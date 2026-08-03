from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from services.forecast_service import seven_day_forecast

class ForecastResponse(BaseModel):
    forecast: Any

router = APIRouter()

@router.get("", response_model=ForecastResponse)
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