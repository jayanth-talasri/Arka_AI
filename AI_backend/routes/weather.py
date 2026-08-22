from fastapi import APIRouter, Depends

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.weather_service import weather_summary
from schemas.response_schema import WeatherResponse
from dependencies.auth import verify_ai_api_key
router = APIRouter()

@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=WeatherResponse)

def weather(

    latitude: float,

    longitude: float,

    start: str,

    end: str

):

    data = get_nasa_weather(

        latitude,

        longitude,

        start,

        end

    )

    df = nasa_json_to_dataframe(data)

    return weather_summary(df)