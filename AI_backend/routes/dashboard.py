from fastapi import APIRouter, Depends

from services.dashboard_service import dashboard
from schemas.response_schema import DashboardResponse
from dependencies.auth import verify_ai_api_key

router = APIRouter()

@router.get(
    "",
    dependencies=[Depends(verify_ai_api_key)],
    response_model=DashboardResponse
)
def dashboard_api(
    latitude: float,
    longitude: float,
    start: str,
    end: str,
    solar_capacity: float = 1.0,
    electricity_rate: float = 8.0,
    appliance_info: str = ""
):
    return dashboard(
        latitude=latitude,
        longitude=longitude,
        start=start,
        end=end,
        solar_capacity=solar_capacity,
        electricity_rate=electricity_rate,
        appliance_info=appliance_info
    )
