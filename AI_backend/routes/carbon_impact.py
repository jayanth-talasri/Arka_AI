from datetime import datetime
from math import isfinite
from zoneinfo import ZoneInfo

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from dependencies.auth import verify_ai_api_key
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.live_weather_service import get_live_weather, get_historical_radiation
from services.live_prediction_service import predict_live_radiation
from services.carbon_service import carbon_impact

router = APIRouter(dependencies=[Depends(verify_ai_api_key)])

def parse_date(value):
    for date_format in ("%Y%m%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value), date_format).date()
        except ValueError:
            continue

    raise HTTPException(
        status_code=400,
        detail="Invalid date. Use YYYYMMDD or YYYY-MM-DD."
    )

def get_actual_radiation(latitude, longitude, target_date):
    date_string = target_date.strftime("%Y%m%d")

    nasa_data = get_nasa_weather(
        latitude,
        longitude,
        date_string,
        date_string
    )

    df = nasa_json_to_dataframe(nasa_data)

    if df.empty or "radiation" not in df.columns:
        return None

    df["radiation"] = pd.to_numeric(
        df["radiation"],
        errors="coerce"
    )

    df = df.replace([-999, -999.0], float("nan"))

    if "date" in df.columns:
        df = df[
            pd.to_datetime(df["date"]).dt.date == target_date
        ]

    valid_values = df["radiation"].dropna()

    valid_values = valid_values[
        valid_values.apply(
            lambda value: isfinite(float(value)) and float(value) >= 0
        )
    ]

    if valid_values.empty:
        return None

    return float(valid_values.iloc[-1])


def get_predicted_radiation(latitude, longitude, target_date):
    date_string = target_date.isoformat()

    live_weather = get_live_weather(
        latitude,
        longitude,
        date_string
    )

    required_weather = [
        "temperature",
        "humidity",
        "wind_speed"
    ]

    missing = [
        field for field in required_weather
        if live_weather.get(field) is None
    ]

    if missing:
        raise ValueError(f"Open-Meteo weather data is incomplete: {missing}")

    prediction = predict_live_radiation(
        latitude,
        longitude,
        date_string,
        live_weather
    )

    prediction = float(prediction)

    if not isfinite(prediction) or prediction < 0:
        raise ValueError("The model returned an invalid radiation prediction.")

    return prediction


@router.get("",)
def carbon(
    latitude: float,
    longitude: float,
    start: str,
    end: str,
    solar_capacity: float,
    electricity_rate: float = 8.0
):
    selected_date = parse_date(end)
    start_date = parse_date(start)

    if start_date != selected_date:
        raise HTTPException(
            status_code=400,
            detail="Carbon impact requires a single selected date."
        )

    if not isfinite(solar_capacity) or solar_capacity <= 0:
        raise HTTPException(
            status_code=422,
            detail="Solar capacity must be greater than zero kWp."
        )

    if not isfinite(electricity_rate) or electricity_rate < 0:
        raise HTTPException(
            status_code=422,
            detail="Electricity rate cannot be negative."
        )

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()

    radiation = None
    source = None
    status = None

    # PAST DATE: use actual NASA POWER radiation only.
    if selected_date < today:
        radiation = get_actual_radiation(
            latitude,
            longitude,
            selected_date
        )
        if radiation is not None:
            source = "NASA POWER"
            status = "actual"
        else:
            print("NASA radiation unavailable. Trying Open-Meteo historical data.")
            radiation = get_historical_radiation(
                latitude,
                longitude,
                selected_date.isoformat()
            )
            if radiation is None:
                raise HTTPException(
                    status_code=422,
                    detail=f"Historical radiation data is unavailable for {selected_date}. NASA POWER and Open-Meteo could not provide a value."
                )
            source = "Open-Meteo Historical"
            status = "estimated"

    # TODAY: prefer valid NASA data; otherwise use the prediction pipeline.
    elif selected_date == today:
        try:
            radiation = get_actual_radiation(
                latitude,
                longitude,
                selected_date
            )
        except Exception as error:
            print("TODAY NASA DATA UNAVAILABLE:", str(error))

        if radiation is not None:
            source = "NASA POWER"
            status = "actual"
        else:
            try:
                radiation = get_predicted_radiation(
                    latitude,
                    longitude,
                    selected_date
                )

                source = "Open-Meteo weather + ArkaAI LSTM"
                status = "predicted"

            except Exception as error:
                raise HTTPException(
                    status_code=502,
                    detail=f"Unable to estimate today's solar performance: {error}"
                ) from error

    # FUTURE DATE: use Open-Meteo weather + existing LSTM prediction.
    else:
        try:
            radiation = get_predicted_radiation(
                latitude,
                longitude,
                selected_date
            )

            source = "Open-Meteo weather + ArkaAI LSTM"
            status = "predicted"

        except Exception as error:
            raise HTTPException(
                status_code=502,
                detail=f"Unable to predict solar performance: {error}"
            ) from error

    return carbon_impact(
        radiation=radiation,
        solar_capacity=solar_capacity,
        electricity_rate=electricity_rate,
        source=source,
        status=status
    )
