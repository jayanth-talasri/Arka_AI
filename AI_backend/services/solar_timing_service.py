
import math
import requests

from datetime import date, datetime, timedelta, timezone

FORECAST_API = "https://api.open-meteo.com/v1/forecast"
HISTORICAL_FORECAST_API = (
    "https://historical-forecast-api.open-meteo.com/v1/forecast"
)
ARCHIVE_API = "https://archive-api.open-meteo.com/v1/archive"

INDIA_TIMEZONE = timezone(timedelta(hours=5, minutes=30))
REQUEST_TIMEOUT = 20


def parse_target_date(value):
    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    value = str(value).strip()

    for fmt in ("%Y%m%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            pass

    raise ValueError("Invalid date. Use YYYYMMDD or YYYY-MM-DD.")


def format_minutes(minutes):
    minutes = int(round(minutes)) % 1440

    hour, minute = divmod(minutes, 60)

    suffix = "AM" if hour < 12 else "PM"
    display_hour = hour % 12 or 12

    return f"{display_hour}:{minute:02d} {suffix}"


def get_solar_times(latitude, longitude, target_date):
    selected_date = parse_target_date(target_date)

    latitude = float(latitude)
    longitude = float(longitude)

    if not -90 <= latitude <= 90:
        raise ValueError("Invalid latitude.")

    if not -180 <= longitude <= 180:
        raise ValueError("Invalid longitude.")

    day_number = selected_date.timetuple().tm_yday
    gamma = 2 * math.pi / 365 * (day_number - 1)

    equation_of_time = 229.18 * (
        0.000075
        + 0.001868 * math.cos(gamma)
        - 0.032077 * math.sin(gamma)
        - 0.014615 * math.cos(2 * gamma)
        - 0.040849 * math.sin(2 * gamma)
    )

    declination = (
        0.006918
        - 0.399912 * math.cos(gamma)
        + 0.070257 * math.sin(gamma)
        - 0.006758 * math.cos(2 * gamma)
        + 0.000907 * math.sin(2 * gamma)
        - 0.002697 * math.cos(3 * gamma)
        + 0.001480 * math.sin(3 * gamma)
    )

    latitude_rad = math.radians(latitude)
    zenith = math.radians(90.833)

    denominator = math.cos(latitude_rad) * math.cos(declination)

    if abs(denominator) < 1e-10:
        raise ValueError("Solar timing unavailable.")

    cos_hour_angle = (
        math.cos(zenith) / denominator
        - math.tan(latitude_rad) * math.tan(declination)
    )

    if not -1 <= cos_hour_angle <= 1:
        raise ValueError("Sunrise or sunset unavailable.")

    hour_angle = math.degrees(math.acos(cos_hour_angle))

    # India Standard Time correction: UTC + 5 hours 30 minutes.
    solar_noon = (
        720 - 4 * longitude - equation_of_time + 330
    )

    sunrise = solar_noon - 4 * hour_angle
    sunset = solar_noon + 4 * hour_angle

    return {
        "date": selected_date.isoformat(),
        "sunrise": format_minutes(sunrise),
        "sunset": format_minutes(sunset),
        "solar_noon": format_minutes(solar_noon),
        "_sunrise": sunrise,
        "_sunset": sunset,
        "_noon": solar_noon
    }


def get_data_source(target_date):
    selected_date = parse_target_date(target_date)
    today = datetime.now(INDIA_TIMEZONE).date()

    days_from_today = (selected_date - today).days

    if -92 <= days_from_today <= 16:
        return FORECAST_API, "Open-Meteo Forecast API"

    if selected_date >= date(2022, 1, 1):
        return (
            HISTORICAL_FORECAST_API,
            "Open-Meteo Historical Forecast API"
        )

    return ARCHIVE_API, "Open-Meteo Historical Weather API"


def get_hourly_solar_profile(latitude, longitude, target_date):
    selected_date = parse_target_date(target_date)

    latitude = float(latitude)
    longitude = float(longitude)

    if not -90 <= latitude <= 90:
        raise ValueError("Invalid latitude.")

    if not -180 <= longitude <= 180:
        raise ValueError("Invalid longitude.")

    api_url, source_name = get_data_source(selected_date)

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "shortwave_radiation",
        "start_date": selected_date.isoformat(),
        "end_date": selected_date.isoformat(),
        "timezone": "Asia/Kolkata"
    }

    response = requests.get(
        api_url,
        params=params,
        timeout=REQUEST_TIMEOUT
    )

    response.raise_for_status()

    payload = response.json()
    hourly = payload.get("hourly", {})

    times = hourly.get("time", [])
    radiation_values = hourly.get("shortwave_radiation", [])

    if not times or not radiation_values:
        raise ValueError("Hourly solar radiation data unavailable.")

    solar = get_solar_times(
        latitude,
        longitude,
        selected_date
    )

    samples = []
    daily_radiation_sum = 0.0

    for timestamp, value in zip(times, radiation_values):
        if value is None:
            continue

        value = float(value)

        if not math.isfinite(value) or value < 0:
            continue

        parsed_time = datetime.fromisoformat(timestamp)

        minute = parsed_time.hour * 60 + parsed_time.minute

        # Hourly radiation is averaged over the preceding hour.
        daily_radiation_sum += value

        midpoint = minute + 30

        if not (
            solar["_sunrise"] <= midpoint <= solar["_sunset"]
        ):
            continue

        samples.append({
            "time": parsed_time.strftime("%H:%M"),
            "minute": minute,
            "radiation_wm2": round(value, 2)
        })

    samples.sort(key=lambda item: item["minute"])

    if not samples:
        raise ValueError(
            "No usable daylight solar radiation data for this date."
        )

    return {
        "date": selected_date.isoformat(),
        "source": source_name,
        "daily_radiation_kwh_m2": round(
            daily_radiation_sum / 1000,
            3
        ),
        "samples": samples,
        "sunrise": solar["sunrise"],
        "sunset": solar["sunset"],
        "solar_noon": solar["solar_noon"]
    }


def build_solar_window(solar, profile=None):
    if profile and profile.get("samples"):
        peak_sample = max(
            profile["samples"],
            key=lambda item: item["radiation_wm2"]
        )

        start = peak_sample["minute"]
        end = start + 60

        return {
            "date": solar["date"],
            "sunrise": solar["sunrise"],
            "sunset": solar["sunset"],
            "solar_noon": solar["solar_noon"],
            "best_time": (
                f"{format_minutes(start)} - "
                f"{format_minutes(end)}"
            ),
            "source": profile["source"],
            "window_radiation": peak_sample["radiation_wm2"]
        }

    # This is only a timing estimate, not measured hourly radiation.
    start = max(solar["_sunrise"], solar["_noon"] - 60)
    end = min(solar["_sunset"], solar["_noon"] + 60)

    return {
        "date": solar["date"],
        "sunrise": solar["sunrise"],
        "sunset": solar["sunset"],
        "solar_noon": solar["solar_noon"],
        "best_time": (
            f"{format_minutes(start)} - "
            f"{format_minutes(end)}"
        ),
        "source": "Astronomical timing estimate",
        "window_radiation": None
    }


def get_best_solar_window(
    latitude,
    longitude,
    target_date,
    radiation=None
):
    solar = get_solar_times(
        latitude,
        longitude,
        target_date
    )

    try:
        profile = get_hourly_solar_profile(
            latitude,
            longitude,
            target_date
        )

        return build_solar_window(solar, profile)

    except Exception as error:
        print("OPEN-METEO SOLAR WINDOW FALLBACK:", str(error))

        return build_solar_window(solar)
