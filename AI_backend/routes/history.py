from fastapi import APIRouter

from services.history_service import get_history

router = APIRouter()

@router.get("/history")
def history(
        latitude: float,
        longitude: float,
        start: str,
        end: str
):

    return get_history(
        latitude,
        longitude,
        start,
        end
    )