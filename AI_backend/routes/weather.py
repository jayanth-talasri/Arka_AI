from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth import verify_ai_api_key
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.weather_service import weather_summary
from services.live_weather_service import(
     get_live_weather,
     get_historical_weather
)
from schemas.response_schema import WeatherResponse
router = APIRouter()
def parse_date(value):
    for date_format in ("%Y%m%d", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value), date_format).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail="Invalid date. Use YYYYMMDD or YYYY-MM-DD.")
@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=WeatherResponse)
def weather(latitude: float, longitude: float, start: str, end: str):
    try:
        start_date = parse_date(start)
        selected_date = parse_date(end)
        if start_date != selected_date:
            raise HTTPException(status_code=400, detail="Weather requires a single selected date.")
        today = datetime.now(ZoneInfo("Asia/Kolkata")).date()
        date_string = selected_date.isoformat()
        if selected_date < today:
            print("WEATHER SOURCE: NASA POWER - HISTORICAL")
            try:
                historical_weather = get_historical_weather(latitude, longitude, date_string)
                result = weather_summary(None, historical_weather )
                result["date"] = date_string
                result["source"] = "Open-Meteo Historical"
                result["status"] = "estimated"
                print("WEATHER SOURCE: OPEN-METEO HISTORICAL")
            except Exception as open_meteo_error:
                print("OPEN-METEO Historical FALLBACK:", str(open_meteo_error))
                print("WEATHER SOURCE: NASA POWER FALLBACK")

                nasa_data = get_nasa_weather(
                    latitude,
                    longitude,
                    selected_date.strftime("%Y%m%d"),
                    selected_date.strftime("%Y%m%d")
                )
                df = nasa_json_to_dataframe(nasa_data)
                result = weather_summary(df)
                result["date"] = date_string
                result["status"] = (
                    "actual" if result["source"] != "Unavailable"
                    else "Unavailable"
                )
        else:
            print("WEATHER SOURCE: OPEN-METEO - TODAY/FUTURE")
            live_weather = get_live_weather(latitude, longitude, date_string)
            result = weather_summary(None, live_weather)
            result["date"] = date_string
            result["status"] = "forecast" if selected_date > today else "current"
        print("FINAL WEATHER RESPONSE:", result)
        return result
    except HTTPException:
        raise
    except Exception as error:
        print("WEATHER ROUTE ERROR:", str(error))
        raise HTTPException(status_code=502, detail=str(error)) from error
