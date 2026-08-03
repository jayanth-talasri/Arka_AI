from fastapi import APIRouter

from services.dashboard_service import dashboard
from schemas.response_schema import DashboardResponse

router = APIRouter()

@router.get("", response_model=DashboardResponse)
def dashboard_api(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    return dashboard(
        latitude,
        longitude,
        start,
        end
    )