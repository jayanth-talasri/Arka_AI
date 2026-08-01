from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.weather_service import weather_summary

router = APIRouter()

@router.get("/weather")

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