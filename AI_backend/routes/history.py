from fastapi import APIRouter, Depends, HTTPException

from services.history_service import get_history
from dependencies.auth import verify_ai_api_key
router = APIRouter()


@router.get("", dependencies=[Depends(verify_ai_api_key)])
def history(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):

    try:

        return get_history(
            latitude,
            longitude,
            start,
            end
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to load historical data: {str(e)}"
        )