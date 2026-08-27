from fastapi import APIRouter, Depends
from services.nasa_service import get_nasa_weather
from dependencies.auth import verify_ai_api_key

router = APIRouter( dependencies=[Depends(verify_ai_api_key)])

@router.get("/weather")
def weather(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):

    data = get_nasa_weather(
        latitude=latitude,
        longitude=longitude,
        start=start,
        end=end
    )

    return data