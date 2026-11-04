
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.analytics_service import calculate_analytics
from schemas.response_schema import AnalyticsResponse
from dependencies.auth import verify_ai_api_key

router = APIRouter()


@router.get(
    "",
    dependencies=[Depends(verify_ai_api_key)],
    response_model=AnalyticsResponse
)
def analytics(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    weather = get_nasa_weather(
        latitude,
        longitude,
        start,
        end
    )

    df = nasa_json_to_dataframe(weather)

    if df.empty:
        raise HTTPException(
            status_code=422,
            detail="No NASA weather records available for the selected dates."
        )

    df = df.copy()

    df["radiation"] = np.asarray(
        df["radiation"],
        dtype=float
    )

    df["radiation"] = df["radiation"].replace(
        [-999, -999.0],
        np.nan
    )

    valid_radiation_df = df[
        df["radiation"].notna()
        & np.isfinite(df["radiation"])
        & (df["radiation"] >= 0)
    ].copy()

    if valid_radiation_df.empty:
        raise HTTPException(
            status_code=422,
            detail="No valid solar radiation records available for analytics."
        )

    result = calculate_analytics(valid_radiation_df)

    return result
