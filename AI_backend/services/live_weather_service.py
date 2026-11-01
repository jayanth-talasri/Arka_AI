import requests
from datetime import date, datetime
from zoneinfo import ZoneInfo
API_URL = "https://api.open-meteo.com/v1/forecast"
def get_live_weather(latitude, longitude, target_date=None):
    today = datetime.now(ZoneInfo("Asia/Kolkata")).date()
    if target_date is None:
        target_date = today.isoformat()
    try:
        selected_date = date.fromisoformat(target_date)
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "hourly": [
                "shortwave_radiation",
                "temperature_2m",
                "relative_humidity_2m",
                "wind_speed_10m",
                "cloud_cover"
            ],
            "start_date": target_date,
            "end_date": target_date,
            "timezone": "Asia/Kolkata"
        }
        response = requests.get(API_URL, params=params, timeout=20)
        response.raise_for_status()
        data = response.json()
        hourly = data.get("hourly") or {}
        def valid_values(field):
            values = hourly.get(field) or []
            result = []
            for value in values:
                try:
                    number = float(value)
                    if number >= 0:
                        result.append(number)
                except (TypeError, ValueError):
                    continue
            return result
        def average(field):
            values = valid_values(field)
            return round(sum(values) / len(values), 2) if values else None
        radiation_values = valid_values("shortwave_radiation")
        daily_radiation = round(sum(radiation_values) / 1000, 3) if radiation_values else None
        current_conditions = None
        if selected_date == today:
            current_response = requests.get(
                API_URL,
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": [
                        "temperature_2m",
                        "relative_humidity_2m",
                        "wind_speed_10m",
                        "cloud_cover",
                        "weather_code"
                    ],
                    "timezone": "Asia/Kolkata"
                },
                timeout=20
            )
            current_response.raise_for_status()
            current_conditions = current_response.json().get("current")
        return {
            "source": "Open-Meteo",
            "data_type": "selected_date_weather",
            "date": target_date,
            "temperature": average("temperature_2m"),
            "humidity": average("relative_humidity_2m"),
            "wind_speed": average("wind_speed_10m"),
            "cloud_cover": average("cloud_cover"),
            "current_conditions": current_conditions,
            "forecast_radiation": daily_radiation,
            "radiation_unit": "kWh/m²/day",
            "radiation_status": "estimated" if daily_radiation is not None else "unavailable"
        }
    except requests.RequestException as error:
        raise RuntimeError(f"Live weather API request failed: {error}") from error
    except (TypeError, ValueError, KeyError) as error:
        raise RuntimeError(f"Unable to process live weather data: {error}") from error