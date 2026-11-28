import numpy as np
import pandas as pd
import requests

from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import HTTPException

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.recommendation import generate_recommendation
from services.analytics_service import calculate_analytics
from services.weather_service import weather_summary
from services.savings_service import calculate_savings
from services.appliance_service import appliance_schedule

from services.live_weather_service import (
    get_live_weather,
    get_historical_radiation
)

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def parse_selected_date(value):
    for date_format in ("%Y%m%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(
                str(value),
                date_format
            ).date()
        except ValueError:
            continue

    raise HTTPException(
        status_code=422,
        detail="Invalid date. Use YYYYMMDD or YYYY-MM-DD."
    )


def empty_weather_dataframe():
    return pd.DataFrame(columns=[
        "date",
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ])

def get_valid_radiation_dataframe(df):
    if df is None or df.empty:
        return empty_weather_dataframe()

    df = df.copy()

    for column in [
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ]:
        if column not in df.columns:
            df[column] = np.nan

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    df = df.replace(
        [-999, -999.0],
        np.nan
    )

    df = df[
        df["radiation"].notna()
        & np.isfinite(df["radiation"])
        & (df["radiation"] >= 0)
    ].copy()

    return df


def get_recent_historical_weather(
    latitude,
    longitude,
    target_date
):
    """
    Retrieve recent historical weather from Open-Meteo.

    Uses past_days so that recent dates are requested
    through the forecast API's historical-data support.
    """

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()

    days_ago = (today - target_date).days

    if days_ago <= 0 or days_ago > 92:
        return None

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "cloud_cover",
            "shortwave_radiation"
        ],
        "past_days": days_ago,
        "forecast_days": 1,
        "timezone": "Asia/Kolkata"
    }

    try:
        response = requests.get(
            OPEN_METEO_URL,
            params=params,
            timeout=(10, 30)
        )

        response.raise_for_status()

        data = response.json()
        hourly = data.get("hourly") or {}

        times = hourly.get("time") or []

        if not times:
            return None

        selected_date_string = target_date.isoformat()

        indexes = [
            index
            for index, timestamp in enumerate(times)
            if timestamp[:10] == selected_date_string
        ]

        if not indexes:
            return None

        def get_values(field):
            values = hourly.get(field) or []
            result = []

            for index in indexes:
                if index >= len(values):
                    continue

                value = values[index]

                try:
                    number = float(value)

                    if not np.isfinite(number):
                        continue

                    if field == "temperature_2m" or number >= 0:
                        result.append(number)

                except (TypeError, ValueError):
                    continue

            return result

        def average(field):
            values = get_values(field)

            if not values:
                return None

            return round(
                sum(values) / len(values),
                2
            )

        radiation_values = get_values(
            "shortwave_radiation"
        )

        daily_radiation = (
            round(sum(radiation_values) / 1000, 3)
            if radiation_values
            else None
        )

        result = {
            "source": "Open-Meteo Historical",
            "temperature": average("temperature_2m"),
            "humidity": average("relative_humidity_2m"),
            "wind_speed": average("wind_speed_10m"),
            "cloud_cover": average("cloud_cover"),
            "forecast_radiation": daily_radiation,
            "current_conditions": None
        }

        if all(
            result[field] is None
            for field in [
                "temperature",
                "humidity",
                "wind_speed"
            ]
        ):
            return None

        return result

    except (
        requests.RequestException,
        ValueError,
        TypeError,
        KeyError
    ) as error:

        print(
            "OPEN-METEO HISTORICAL WEATHER ERROR:",
            str(error)
        )

        return None

def dashboard(
    latitude,
    longitude,
    start,
    end,
    solar_capacity=1.0,
    electricity_rate=8.0,
    appliance_info=""
):
    # --------------------------------------------------
    # 1. Parse dates
    # --------------------------------------------------
    selected_date = parse_selected_date(end)
    start_date = parse_selected_date(start)

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()

    if start_date > selected_date:
        raise HTTPException(
            status_code=422,
            detail="Start date cannot be after end date."
        )

    if selected_date > today:
        raise HTTPException(
            status_code=422,
            detail="Dashboard supports historical dates and today only."
        )

    # --------------------------------------------------
    # 2. Retrieve NASA data
    # --------------------------------------------------
    df = empty_weather_dataframe()

    try:
        weather_json = get_nasa_weather(
            latitude,
            longitude,
            start,
            end
        )

        nasa_df = nasa_json_to_dataframe(
            weather_json
        )

        if nasa_df is not None and not nasa_df.empty:
            df = nasa_df.copy()

    except Exception as error:
        print(
            "DASHBOARD NASA DATA ERROR:",
            str(error)
        )

    for column in [
        "date",
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ]:
        if column not in df.columns:
            df[column] = np.nan

    # --------------------------------------------------
    # 3. Clean NASA radiation data
    # --------------------------------------------------
    valid_radiation_df = get_valid_radiation_dataframe( df )
    valid_dates = pd.Series(dtype="datetime64[ns]")

    if (
        not valid_radiation_df.empty
        and "date" in valid_radiation_df.columns
    ):
        valid_dates = pd.to_datetime(
            valid_radiation_df["date"],
            errors="coerce"
        ).dropna()

    print("\n========= DASHBOARD DATE DEBUG =========")
    print("REQUESTED START:", start)
    print("REQUESTED END:", end)
    print("SELECTED DATE:", selected_date)
    print("VALID RADIATION RECORDS:", len(valid_radiation_df))

    if not valid_dates.empty:
        print("FIRST DATA DATE:", valid_dates.min())
        print("LAST DATA DATE:", valid_dates.max())
    else:
        print("FIRST DATA DATE: No valid records")
        print("LAST DATA DATE: No valid records")

    print("========================================\n")

    # --------------------------------------------------
    # 4. Retrieve Open-Meteo weather
    # --------------------------------------------------
    live_weather = None

    if selected_date == today:

        try:
            live_weather = get_live_weather(
                latitude,
                longitude,
                selected_date.isoformat()
            )

            print(
                "DASHBOARD WEATHER SOURCE: Open-Meteo"
            )

        except Exception as error:
            print(
                "DASHBOARD LIVE WEATHER ERROR:",
                str(error)
            )

    elif selected_date < today:

        live_weather = get_recent_historical_weather(
            latitude,
            longitude,
            selected_date
        )

        if live_weather:
            print(
                "DASHBOARD WEATHER SOURCE: Open-Meteo Historical"
            )

    # --------------------------------------------------
    # 5. Check whether NASA has radiation for the date
    # --------------------------------------------------
    selected_radiation_exists = False

    if (
        not valid_radiation_df.empty
        and "date" in valid_radiation_df.columns
    ):
        dates = pd.to_datetime(
            valid_radiation_df["date"],
            errors="coerce"
        ).dt.date

        selected_radiation_exists = (
            dates == selected_date
        ).any()

    fallback_radiation = None
    fallback_source = None

    # --------------------------------------------------
    # 6. Radiation fallback
    # --------------------------------------------------
    if not selected_radiation_exists:

        if selected_date == today:

            if live_weather:
                try:
                    value = live_weather.get(
                        "forecast_radiation"
                    )

                    if value is not None:
                        value = float(value)

                        if (
                            np.isfinite(value)
                            and value >= 0
                        ):
                            fallback_radiation = value
                            fallback_source = "Open-Meteo"

                except (TypeError, ValueError):
                    pass

        else:

            try:
                fallback_radiation = get_historical_radiation(
                    latitude,
                    longitude,
                    selected_date.isoformat()
                )

                if fallback_radiation is not None:
                    fallback_radiation = float(
                        fallback_radiation
                    )

                    if (
                        not np.isfinite(fallback_radiation)
                        or fallback_radiation < 0
                    ):
                        fallback_radiation = None
                    else:
                        fallback_source = "Open-Meteo Historical"

            except Exception as error:
                print(
                    "DASHBOARD RADIATION FALLBACK ERROR:",
                    str(error)
                )

    # --------------------------------------------------
    # 7. Add fallback radiation if available
    # --------------------------------------------------
    if fallback_radiation is not None:

        fallback_row = {
            "date": pd.Timestamp(selected_date),
            "radiation": fallback_radiation,
            "temperature": np.nan,
            "humidity": np.nan,
            "wind_speed": np.nan
        }

        valid_radiation_df = pd.concat(
            [
                valid_radiation_df,
                pd.DataFrame([fallback_row])
            ],
            ignore_index=True
        )

        print(
            f"DASHBOARD RADIATION SOURCE: {fallback_source}"
        )

    # --------------------------------------------------
    # 8. Prepare weather summary
    # --------------------------------------------------
    weather_result = weather_summary(
        df,
        live_weather
    )

    # --------------------------------------------------
    # 9. Handle unavailable radiation
    # --------------------------------------------------
    if valid_radiation_df.empty:

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "prediction": {
                "predicted_radiation": None,
                "unit": "kWh/m²/day",
                "source": "Unavailable"
            },

            "weather": weather_result,

            "recommendation": {
                "status": "Unavailable",
                "energy": 0,
                "saving": 0,
                "message": (
                    "Solar radiation data is unavailable "
                    "from NASA POWER and Open-Meteo."
                )
            },

            "analytics": {},
            "savings": {},

            "appliances": {
                "status": "Unavailable",
                "best_time": "Not available",
                "recommended": [],
                "not_recommended": [],
                "appliance_schedules": [],
                "recommendation_notes": [
                    "Solar radiation data is unavailable."
                ]
            }
        }

    # --------------------------------------------------
    # 10. Calculate radiation
    # --------------------------------------------------
    average_radiation = float(
        valid_radiation_df["radiation"].mean()
    )

    if selected_radiation_exists:
        prediction_source = "NASA POWER actual radiation"

    elif fallback_source:
        prediction_source = fallback_source

    else:
        prediction_source = "Available radiation data"

    prediction = average_radiation

    # --------------------------------------------------
    # 11. Future prediction branch
    # --------------------------------------------------
    if selected_date > today:

        prediction_df = valid_radiation_df.dropna(
            subset=[
                "temperature",
                "humidity",
                "wind_speed"
            ]
        ).copy()

        if prediction_df.empty:
            raise HTTPException(
                status_code=422,
                detail=(
                    "Insufficient valid weather data "
                    "for radiation prediction."
                )
            )

        prediction = float(
            predict_radiation(prediction_df)
        )

        prediction_source = "AI model prediction"

    # --------------------------------------------------
    # 12. Analytics
    # --------------------------------------------------
    try:
        analytics_result = calculate_analytics(
            valid_radiation_df
        )

    except Exception as error:
        raise HTTPException(
            status_code=422,
            detail=f"Dashboard analytics calculation failed: {error}"
        ) from error

    # --------------------------------------------------
    # 13. Savings
    # --------------------------------------------------
    try:
        savings_result = calculate_savings(
            valid_radiation_df,
            solar_capacity=solar_capacity,
            electricity_rate=electricity_rate
        )

    except Exception as error:
        raise HTTPException(
            status_code=422,
            detail=f"Dashboard savings calculation failed: {error}"
        ) from error

    # --------------------------------------------------
    # 14. Solar recommendation
    # --------------------------------------------------
    recommendation_result = generate_recommendation(
        prediction,
        solar_capacity,
        electricity_rate
    )

    # --------------------------------------------------
    # 15. Appliance recommendations
    # --------------------------------------------------
    appliance_result = appliance_schedule(
        average_radiation=prediction,
        appliance_info=appliance_info,
        solar_capacity=solar_capacity,
        electricity_rate=electricity_rate,
        latitude=latitude,
        longitude=longitude,
        target_date=selected_date
    )

    # --------------------------------------------------
    # 16. Final response
    # --------------------------------------------------
    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "prediction": {
            "predicted_radiation": round(
                float(prediction),
                2
            ),
            "unit": "kWh/m²/day",
            "source": prediction_source
        },

        "weather": weather_result,
        "recommendation": recommendation_result,
        "analytics": analytics_result,
        "savings": savings_result,
        "appliances": appliance_result
    }
