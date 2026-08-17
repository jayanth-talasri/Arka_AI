from fastapi import APIRouter, HTTPException

from services.history_service import get_history

router = APIRouter()


@router.get("/")
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