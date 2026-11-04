import requests
from datetime import date, datetime, timedelta
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
        raise RuntimeError(f"Live Open-Meteo request failed: {error}") from error
    except (TypeError, ValueError, KeyError) as error:
        raise RuntimeError(f"Unable to process live Open-Meteo data: {error}") from error
    
def get_seven_day_live_weather(latitude, longitude, start_date, end_date):
    """
    Fetch weather for an entire date range using one Open-Meteo request.
    Returns one weather dictionary per date, compatible with the
    existing live_prediction_service input.
    """
    from datetime import date

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
        "start_date": start_date,
        "end_date": end_date,
        "timezone": "Asia/Kolkata"
    }

    try:
        response = requests.get(API_URL, params=params, timeout=(10, 60))
        response.raise_for_status()
        data = response.json()

        hourly = data.get("hourly") or {}
        times = hourly.get("time") or []

        if not times:
            raise ValueError("Open-Meteo returned no hourly records.")

        fields = [
            "shortwave_radiation",
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "cloud_cover"
        ]

        grouped = {}

        for index, timestamp in enumerate(times):
            day = timestamp[:10]
            grouped.setdefault(day, {field: [] for field in fields})

            for field in fields:
                values = hourly.get(field) or []
                if index < len(values):
                    value = values[index]
                    try:
                        number = float(value)
                        if number >= 0:
                            grouped[day][field].append(number)
                    except (TypeError, ValueError):
                        pass

        result = {}

        for day, values in grouped.items():
            def average(field):
                items = values[field]
                return round(sum(items) / len(items), 2) if items else None

            radiation_values = values["shortwave_radiation"]
            daily_radiation = (
                round(sum(radiation_values) / 1000, 3)
                if radiation_values else None
            )

            result[day] = {
                "source": "Open-Meteo",
                "data_type": "selected_date_weather",
                "date": day,
                "temperature": average("temperature_2m"),
                "humidity": average("relative_humidity_2m"),
                "wind_speed": average("wind_speed_10m"),
                "cloud_cover": average("cloud_cover"),
                "current_conditions": None,
                "forecast_radiation": daily_radiation,
                "radiation_unit": "kWh/m²/day",
                "radiation_status": (
                    "estimated" if daily_radiation is not None
                    else "unavailable"
                )
            }

        expected_dates = {
            (date.fromisoformat(start_date) + timedelta(days=offset)).isoformat()
            for offset in range(
                (date.fromisoformat(end_date) - date.fromisoformat(start_date)).days + 1
            )
        }

        missing_dates = expected_dates - set(result)
        if missing_dates:
            raise ValueError(
                f"Open-Meteo did not return these dates: {sorted(missing_dates)}"
            )

        return result

    except requests.RequestException as error:
        raise RuntimeError(
            f"Seven-day Open-Meteo request failed: {error}"
        ) from error
    except (TypeError, ValueError, KeyError) as error:
        raise RuntimeError(
            f"Unable to process seven-day Open-Meteo data: {error}"
        ) from error
