from fastapi import APIRouter

from services.forecast_service import seven_day_forecast

router = APIRouter()

@router.get("/forecast")
def forecast(
        latitude: float,
        longitude: float,
        start: str,
        end: str
):

    return {
        "forecast":
        seven_day_forecast(
            latitude,
            longitude,
            start,
            end
        )
    }