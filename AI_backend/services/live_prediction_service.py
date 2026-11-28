
import pandas as pd

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation


def predict_live_radiation(
    latitude,
    longitude,
    target_date,
    live_weather,
    history_df=None
):
    target = datetime.strptime(
        str(target_date),
        "%Y-%m-%d"
    ).date()

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()

    # Use only completed historical days.
    history_end = today - timedelta(days=1)
    history_start = history_end - timedelta(days=44)

    # --------------------------------------------------
    # 1. Retrieve historical NASA records if not supplied
    # --------------------------------------------------
    if history_df is None:
        nasa_data = get_nasa_weather(
            latitude,
            longitude,
            history_start.strftime("%Y%m%d"),
            history_end.strftime("%Y%m%d")
        )

        history_df = nasa_json_to_dataframe(nasa_data)

    else:
        history_df = history_df.copy()

    if history_df is None or history_df.empty:
        raise ValueError(
            "No historical NASA records available for LSTM prediction."
        )

    if "date" not in history_df.columns:
        raise ValueError(
            "Historical NASA data does not contain a date column."
        )

    # --------------------------------------------------
    # 2. Restrict history to the last 45 completed days
    # --------------------------------------------------
    history_df["date"] = pd.to_datetime(
        history_df["date"],
        errors="coerce"
    )

    history_df = history_df.dropna(
        subset=["date"]
    )

    history_df = history_df[
        (history_df["date"].dt.date >= history_start)
        & (history_df["date"].dt.date <= history_end)
    ].copy()

    required_columns = [
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ]

    for column in required_columns:
        if column not in history_df.columns:
            raise ValueError(
                f"Historical NASA data is missing {column}."
            )

        history_df[column] = pd.to_numeric(
            history_df[column],
            errors="coerce"
        )

    history_df = history_df.replace(
        [-999, -999.0],
        float("nan")
    )

    history_df = history_df.dropna(
        subset=required_columns
    )

    history_df = history_df[
        (history_df["radiation"] >= 0)
        & history_df["temperature"].between(-50, 60)
        & history_df["humidity"].between(0, 100)
        & (history_df["wind_speed"] >= 0)
    ].sort_values("date")

    if history_df.empty:
        raise ValueError(
            "No complete historical NASA records are available for LSTM input."
        )

    # --------------------------------------------------
    # 3. Extract live Open-Meteo weather
    # --------------------------------------------------
    if not isinstance(live_weather, dict):
        raise ValueError(
            "Invalid live weather response."
        )

    hourly = live_weather.get("hourly") or {}

    def to_valid_number(value):
        try:
            number = float(value)

            if pd.isna(number):
                return None

            return number

        except (TypeError, ValueError):
            return None

    def hourly_average(field, fallback):
        values = hourly.get(field) or []

        valid_values = []

        for value in values:
            number = to_valid_number(value)

            if number is not None:
                valid_values.append(number)

        if valid_values:
            return sum(valid_values) / len(valid_values)

        return to_valid_number(fallback)

    live_row = {
        "date": pd.Timestamp(target),
        "radiation": float("nan"),

        "temperature": hourly_average(
            "temperature_2m",
            live_weather.get("temperature")
        ),

        "humidity": hourly_average(
            "relative_humidity_2m",
            live_weather.get("humidity")
        ),

        "wind_speed": hourly_average(
            "wind_speed_10m",
            live_weather.get("wind_speed")
        )
    }

    if any(
        live_row[column] is None
        for column in [
            "temperature",
            "humidity",
            "wind_speed"
        ]
    ):
        raise ValueError(
            "Live weather inputs are incomplete for LSTM prediction."
        )

    # --------------------------------------------------
    # 4. Prepare LSTM input
    # --------------------------------------------------
    prediction_df = pd.concat(
        [
            history_df,
            pd.DataFrame([live_row])
        ],
        ignore_index=True
    )

    prediction_df = prediction_df.sort_values(
        "date"
    ).reset_index(drop=True)

    # --------------------------------------------------
    # 5. Generate radiation prediction
    # --------------------------------------------------
    prediction = predict_radiation(
        prediction_df
    )

    prediction = float(prediction)

    if not pd.notna(prediction):
        raise ValueError(
            "LSTM returned an invalid radiation prediction."
        )

    return max(0.0, prediction)
