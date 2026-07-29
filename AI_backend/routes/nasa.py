from fastapi import APIRouter
from services.nasa_service import get_nasa_weather

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

    return data