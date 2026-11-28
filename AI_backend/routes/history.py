
from fastapi import APIRouter, Depends, HTTPException

from dependencies.auth import verify_ai_api_key
from services.history_service import get_history


router = APIRouter(
    dependencies=[Depends(verify_ai_api_key)]
)


@router.get("")
def history(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    try:
        result = get_history(
            latitude=latitude,
            longitude=longitude,
            start=start,
            end=end
        )

        return result

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    except Exception as error:
        print("HISTORY API ERROR:", str(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to load historical solar data."
        )
