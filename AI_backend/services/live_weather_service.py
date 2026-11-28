
import requests
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo


API_URL = "https://api.open-meteo.com/v1/forecast"
ARCHIVE_API_URL = "https://archive-api.open-meteo.com/v1/archive"
TIMEZONE = "Asia/Kolkata"


def get_historical_weather(latitude, longitude, target_date):
    """
    Fetch historical hourly weather from Open-Meteo.

    Supports dates from yesterday up to 92 days in the past.
    Returns daily averages for temperature, humidity, wind speed,
    and cloud cover.
    """

    target = date.fromisoformat(str(target_date))
    today = datetime.now(ZoneInfo(TIMEZONE)).date()

    days_ago = (today - target).days

    if days_ago < 1 or days_ago > 92:
        raise ValueError(
            "Date is outside the recent historical-weather range."
        )

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "wind_speed_10m",
            "cloud_cover"
        ],
        "past_days": days_ago,
        "forecast_days": 1,
        "timezone": TIMEZONE
    }

    try:
        response = requests.get(
            API_URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()

        hourly = response.json().get("hourly") or {}
        times = hourly.get("time") or []

        selected_indices = [
            index
            for index, timestamp in enumerate(times)
            if timestamp[:10] == target.isoformat()
        ]

        if not selected_indices:
            raise ValueError(
                f"No historical weather records found for {target_date}."
            )

        def get_average(field):
            values = hourly.get(field) or []
            valid = []

            for index in selected_indices:
                if index >= len(values):
                    continue

                value = values[index]

                if value is None:
                    continue

                try:
                    number = float(value)

                    if field == "temperature_2m" or number >= 0:
                        valid.append(number)

                except (TypeError, ValueError):
                    continue

            return (
                round(sum(valid) / len(valid), 2)
                if valid else None
            )

        result = {
            "source": "Open-Meteo Historical",
            "data_type": "historical_weather",
            "date": target.isoformat(),
            "temperature": get_average("temperature_2m"),
            "humidity": get_average("relative_humidity_2m"),
            "wind_speed": get_average("wind_speed_10m"),
            "cloud_cover": get_average("cloud_cover"),
            "current_conditions": None,
            "forecast_radiation": None,
            "radiation_status": "unavailable"
        }

        if all(
            result[field] is None
            for field in (
                "temperature",
                "humidity",
                "wind_speed",
                "cloud_cover"
            )
        ):
            raise ValueError(
                "Open-Meteo returned no usable historical weather values."
            )

        return result

    except requests.RequestException as error:
        raise RuntimeError(
            f"Open-Meteo historical weather request failed: {error}"
        ) from error


def get_historical_radiation(latitude, longitude, target_date):
    """
    Fetch historical daily solar radiation.

    First tries Open-Meteo recent history for dates within 92 days.
    If unavailable, uses the Open-Meteo historical archive.

    Returns radiation in kWh/m2/day.
    """

    target = date.fromisoformat(str(target_date))
    today = datetime.now(ZoneInfo(TIMEZONE)).date()

    days_ago = (today - target).days

    # First: Try Open-Meteo recent history.
    if 0 < days_ago <= 92:
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "daily": "shortwave_radiation_sum",
                "past_days": days_ago,
                "forecast_days": 1,
                "timezone": TIMEZONE
            }

            response = requests.get(
                API_URL,
                params=params,
                timeout=30
            )
            response.raise_for_status()

            daily = response.json().get("daily") or {}
            dates = daily.get("time") or []
            values = daily.get("shortwave_radiation_sum") or []

            if target.isoformat() in dates:
                index = dates.index(target.isoformat())

                if index < len(values):
                    value = values[index]

                    if value is not None and float(value) >= 0:
                        return round(float(value) / 3.6, 4)

        except (
            requests.RequestException,
            ValueError,
            TypeError
        ) as error:
            print(
                "OPEN-METEO RECENT RADIATION ERROR:",
                str(error)
            )

    # Second: Try historical archive.
    try:
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": target.isoformat(),
            "end_date": target.isoformat(),
            "daily": "shortwave_radiation_sum",
            "timezone": TIMEZONE
        }

        response = requests.get(
            ARCHIVE_API_URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()

        daily = response.json().get("daily") or {}
        values = daily.get("shortwave_radiation_sum") or []

        if values and values[0] is not None:
            value = float(values[0])

            if value >= 0:
                return round(value / 3.6, 4)

    except (
        requests.RequestException,
        ValueError,
        TypeError
    ) as error:
        print(
            "OPEN-METEO ARCHIVE RADIATION ERROR:",
            str(error)
        )

    return None


def get_live_weather(latitude, longitude, target_date=None):
    """
    Fetch hourly weather for today or a selected future date.
    """

    today = datetime.now(ZoneInfo(TIMEZONE)).date()

    if target_date is None:
        target_date = today.isoformat()

    try:
        selected_date = date.fromisoformat(str(target_date))

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
            "start_date": selected_date.isoformat(),
            "end_date": selected_date.isoformat(),
            "timezone": TIMEZONE
        }

        response = requests.get(
            API_URL,
            params=params,
            timeout=30
        )
        response.raise_for_status()

        data = response.json()
        hourly = data.get("hourly") or {}

        def valid_values(field):
            values = hourly.get(field) or []
            result = []

            for value in values:
                if value is None:
                    continue

                try:
                    number = float(value)

                    if field == "temperature_2m" or number >= 0:
                        result.append(number)

                except (TypeError, ValueError):
                    continue

            return result

        def average(field):
            values = valid_values(field)

            return (
                round(sum(values) / len(values), 2)
                if values else None
            )

        radiation_values = valid_values("shortwave_radiation")

        daily_radiation = (
            round(sum(radiation_values) / 1000, 3)
            if radiation_values else None
        )

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
                    "timezone": TIMEZONE
                },
                timeout=30
            )

            current_response.raise_for_status()

            current_conditions = (
                current_response.json().get("current")
            )

        return {
            "source": "Open-Meteo",
            "data_type": "selected_date_weather",
            "date": selected_date.isoformat(),
            "temperature": average("temperature_2m"),
            "humidity": average("relative_humidity_2m"),
            "wind_speed": average("wind_speed_10m"),
            "cloud_cover": average("cloud_cover"),
            "current_conditions": current_conditions,
            "forecast_radiation": daily_radiation,
            "radiation_unit": "kWh/m2/day",
            "radiation_status": (
                "estimated"
                if daily_radiation is not None
                else "unavailable"
            )
        }

    except requests.RequestException as error:
        raise RuntimeError(
            f"Live Open-Meteo request failed: {error}"
        ) from error

    except (TypeError, ValueError, KeyError) as error:
        raise RuntimeError(
            f"Unable to process live Open-Meteo data: {error}"
        ) from error


def get_seven_day_live_weather(
    latitude,
    longitude,
    start_date,
    end_date
):
    """
    Fetch hourly Open-Meteo data and group it into daily records.
    Used by the seven-day Forecast service.
    """

    start = date.fromisoformat(str(start_date))
    end = date.fromisoformat(str(end_date))

    if end < start:
        raise ValueError("End date cannot be earlier than start date.")

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
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "timezone": TIMEZONE
    }

    try:
        response = requests.get(
            API_URL,
            params=params,
            timeout=(10, 60)
        )
        response.raise_for_status()

        data = response.json()
        hourly = data.get("hourly") or {}
        times = hourly.get("time") or []

        if not times:
            raise ValueError(
                "Open-Meteo returned no hourly records."
            )

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

            grouped.setdefault(
                day,
                {field: [] for field in fields}
            )

            for field in fields:
                values = hourly.get(field) or []

                if index >= len(values):
                    continue

                value = values[index]

                if value is None:
                    continue

                try:
                    number = float(value)

                    if field == "temperature_2m" or number >= 0:
                        grouped[day][field].append(number)

                except (TypeError, ValueError):
                    continue

        result = {}

        for day, values in grouped.items():

            def average(field):
                items = values[field]

                return (
                    round(sum(items) / len(items), 2)
                    if items else None
                )

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
                "radiation_unit": "kWh/m2/day",
                "radiation_status": (
                    "estimated"
                    if daily_radiation is not None
                    else "unavailable"
                )
            }

        expected_dates = {
            (start + timedelta(days=offset)).isoformat()
            for offset in range((end - start).days + 1)
        }

        missing_dates = expected_dates - set(result)

        if missing_dates:
            raise ValueError(
                f"Open-Meteo did not return these dates: "
                f"{sorted(missing_dates)}"
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
