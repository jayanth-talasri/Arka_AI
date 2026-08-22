from fastapi import APIRouter, Depends

from services.dashboard_service import dashboard
from schemas.response_schema import DashboardResponse
from dependencies.auth import verify_ai_api_key
router = APIRouter()

@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=DashboardResponse)
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