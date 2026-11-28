
import pandas as pd
def weather_summary(df, live_weather=None):
    required_columns = ["temperature", "humidity", "wind_speed"]
    def valid_value(value):
        try:
            number = float(value)
            if pd.isna(number) or number == -999:
                return None
            return round(number, 2)
        except (TypeError, ValueError):
            return None
    nasa_weather = {}
    if df is not None and not df.empty:
        missing_columns = [column for column in required_columns if column not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing weather columns: {missing_columns}")
        valid_df = df.copy()
        for column in required_columns:
            valid_df[column] = pd.to_numeric(valid_df[column], errors="coerce")
            valid_df.loc[valid_df[column] == -999, column] = float("nan")
        if "date" in valid_df.columns:
            valid_df = valid_df.sort_values("date")
        for column in required_columns:
            values = valid_df[column].dropna()
            nasa_weather[column] = valid_value(values.iloc[-1]) if not values.empty else None
    live_weather = live_weather or {}
    live_values = {column: valid_value(live_weather.get(column)) for column in required_columns}
    weather = {}
    for column in required_columns:
        weather[column] = live_values[column] if live_values[column] is not None else nasa_weather.get(column)
    if all(value is None for value in weather.values()):
        condition = "Unavailable"
        source = "Unavailable"
    else:
        temperature = weather["temperature"]
        cloud_cover = valid_value(live_weather.get("cloud_cover"))
        if cloud_cover is not None:
            condition = "Clear" if cloud_cover < 20 else "Partly cloudy" if cloud_cover < 60 else "Cloudy"
        elif temperature is not None:
            condition = "Sunny" if temperature > 28 else "Cloudy"
        else:
            condition = "Partly cloudy"
        if any(value is not None for value in live_values.values()):
            source = "Open-Meteo" if all(value is not None for value in live_values.values()) else "Open-Meteo (incomplete)"
        else:
            source = "NASA POWER" if all(nasa_weather.get(column) is not None for column in required_columns) else "NASA POWER (incomplete)"
    return {
        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "wind_speed": weather["wind_speed"],
        "condition": condition,
        "source": source
    }
