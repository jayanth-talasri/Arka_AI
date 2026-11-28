import numpy as np
import pandas as pd

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.live_weather_service import (
    get_historical_weather,
    get_historical_radiation,
    get_live_weather,
)

TIMEZONE = "Asia/Kolkata"

REQUIRED_COLUMNS = [
    "radiation",
    "temperature",
    "humidity",
    "wind_speed",
]


def _is_valid(value, column):
    try:
        number = float(value)

        if not np.isfinite(number) or number == -999:
            return False

        if column in ("radiation", "wind_speed") and number < 0:
            return False

        if column == "humidity" and not 0 <= number <= 100:
            return False

        return True

    except (TypeError, ValueError):
        return False


def get_solar_data(
    latitude,
    longitude,
    start,
    end,
    required_columns=None,
):
    """
    Prepare daily solar and weather data.

    NASA POWER is the primary source.
    Open-Meteo fills missing or invalid NASA values.

    Dates must use YYYYMMDD format.
    """

    required_columns = required_columns or REQUIRED_COLUMNS

    for column in required_columns:
        if column not in REQUIRED_COLUMNS:
            raise ValueError(f"Unsupported solar data column: {column}")

    start_date = datetime.strptime(start, "%Y%m%d").date()
    end_date = datetime.strptime(end, "%Y%m%d").date()

    if end_date < start_date:
        raise ValueError("End date cannot be earlier than start date.")

    # --------------------------------------------------
    # 1. Fetch NASA POWER data
    # --------------------------------------------------

    nasa_df = pd.DataFrame()

    try:
        nasa_response = get_nasa_weather(
            latitude=latitude,
            longitude=longitude,
            start=start,
            end=end,
        )

        nasa_df = nasa_json_to_dataframe(nasa_response)

    except Exception as error:
        print("NASA DATA ERROR:", str(error))
        print("Continuing with Open-Meteo fallback.")

    # --------------------------------------------------
    # 2. Prepare NASA records by date
    # --------------------------------------------------

    nasa_records = {}

    if not nasa_df.empty:
        nasa_df = nasa_df.copy()

        for column in REQUIRED_COLUMNS:
            if column in nasa_df.columns:
                nasa_df[column] = pd.to_numeric(
                    nasa_df[column],
                    errors="coerce",
                )

                nasa_df[column] = nasa_df[column].replace(
                    [-999, -999.0],
                    np.nan,
                )

        for _, row in nasa_df.iterrows():
            target = pd.to_datetime(row["date"]).date()

            nasa_records[target] = row.to_dict()

    # --------------------------------------------------
    # 3. Build every expected date
    # --------------------------------------------------

    today = datetime.now(ZoneInfo(TIMEZONE)).date()

    rows = []
    missing_dates = []

    total_days = (end_date - start_date).days

    for offset in range(total_days + 1):

        target_date = start_date + timedelta(days=offset)

        nasa_record = nasa_records.get(target_date, {})

        record = {
            "date": pd.Timestamp(target_date),
        }

        for column in REQUIRED_COLUMNS:
            value = nasa_record.get(column)

            record[column] = (
                float(value)
                if _is_valid(value, column)
                else np.nan
            )

        # --------------------------------------------------
        # 4. Identify missing fields
        # --------------------------------------------------

        missing_columns = [
            column
            for column in required_columns
            if not _is_valid(record.get(column), column)
        ]

        if missing_columns:

            open_meteo_data = {}

            try:

                if target_date < today:

                    # Historical weather fields
                    if any(
                        column in missing_columns
                        for column in (
                            "temperature",
                            "humidity",
                            "wind_speed",
                        )
                    ):
                        open_meteo_data = get_historical_weather(
                            latitude,
                            longitude,
                            target_date.isoformat(),
                        )

                    # Historical solar radiation
                    if "radiation" in missing_columns:
                        radiation = get_historical_radiation(
                            latitude,
                            longitude,
                            target_date.isoformat(),
                        )

                        open_meteo_data["forecast_radiation"] = radiation

                else:

                    # Today's or future weather and radiation
                    open_meteo_data = get_live_weather(
                        latitude,
                        longitude,
                        target_date.isoformat(),
                    )

            except Exception as error:
                print(
                    f"OPEN-METEO FALLBACK ERROR: "
                    f"{target_date} | {error}"
                )

            # --------------------------------------------------
            # 5. Fill only missing NASA values
            # --------------------------------------------------

            fallback_mapping = {
                "radiation": "forecast_radiation",
                "temperature": "temperature",
                "humidity": "humidity",
                "wind_speed": "wind_speed",
            }

            for column in missing_columns:

                fallback_value = open_meteo_data.get(
                    fallback_mapping[column]
                )

                if _is_valid(fallback_value, column):

                    record[column] = float(fallback_value)

                    print(
                        f"OPEN-METEO FALLBACK: "
                        f"{target_date} | "
                        f"{column} = {fallback_value}"
                    )

        # --------------------------------------------------
        # 6. Validate required fields
        # --------------------------------------------------

        unresolved = [
            column
            for column in required_columns
            if not _is_valid(record.get(column), column)
        ]

        if unresolved:
            missing_dates.append({
                "date": target_date.isoformat(),
                "missing_fields": unresolved,
            })

        rows.append(record)

    # --------------------------------------------------
    # 7. Return validated dataframe
    # --------------------------------------------------

    result_df = pd.DataFrame(rows)

    for column in REQUIRED_COLUMNS:
        result_df[column] = pd.to_numeric(
            result_df[column],
            errors="coerce",
        )

    if missing_dates:
        raise ValueError(
            "Solar/weather data unavailable for some selected dates: "
            f"{missing_dates}"
        )

    if result_df.empty:
        raise ValueError("No solar data available for the selected dates.")

    result_df = result_df.sort_values("date").reset_index(drop=True)

    print("\n========== SOLAR DATA SERVICE ==========")
    print(result_df.to_string(index=False))
    print("========================================\n")

    return result_df
