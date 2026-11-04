
import pandas as pd
from datetime import datetime, timedelta
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
def predict_live_radiation(
        latitude,
        longitude,
        target_date,
        live_weather,
        history_df=None):
    target = datetime.strptime(target_date, "%Y-%m-%d").date()
    history_end = target - timedelta(days=1)
    history_start = history_end - timedelta(days=44)

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
        history_df = history_df[
            (history_df["date"] >= pd.Timestamp(history_start)) &
            (history_df["date"] <= pd.Timestamp(history_end))
        ].copy()
    if history_df.empty:
        raise ValueError("No historical NASA records available for LSTM prediction.")
    history_df["radiation"] = pd.to_numeric(history_df["radiation"], errors="coerce")
    history_df["temperature"] = pd.to_numeric(history_df["temperature"], errors="coerce")
    history_df["humidity"] = pd.to_numeric(history_df["humidity"], errors="coerce")
    history_df["wind_speed"] = pd.to_numeric(history_df["wind_speed"], errors="coerce")
    history_df = history_df.replace([-999, -999.0], float("nan"))
    history_df = history_df.dropna(subset=["radiation", "temperature", "humidity", "wind_speed"])
    history_df = history_df[
        (history_df["radiation"] >= 0) &
        (history_df["temperature"].between(-50, 60)) &
        (history_df["humidity"].between(0, 100)) &
        (history_df["wind_speed"] >= 0)
    ].sort_values("date")
    if history_df.empty:
        raise ValueError("No complete historical NASA records are available for LSTM input.")
    hourly = live_weather.get("hourly") or {}
    def hourly_average(field, fallback):
        values = hourly.get(field) or []
        valid = [float(value) for value in values if value is not None]
        return sum(valid) / len(valid) if valid else fallback
    live_row = {
        "date": pd.Timestamp(target),
        "radiation": float("nan"),
        "temperature": hourly_average("temperature_2m", live_weather.get("temperature")),
        "humidity": hourly_average("relative_humidity_2m", live_weather.get("humidity")),
        "wind_speed": hourly_average("wind_speed_10m", live_weather.get("wind_speed"))
    }
    if any(live_row[key] is None for key in ["temperature", "humidity", "wind_speed"]):
        raise ValueError("Live weather inputs are incomplete for LSTM prediction.")
    prediction_df = pd.concat(
        [history_df, pd.DataFrame([live_row])],
        ignore_index=True
    )
    prediction = predict_radiation(prediction_df)
    return max(0.0, float(prediction))
