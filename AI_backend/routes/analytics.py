from fastapi import APIRouter, Depends

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.analytics_service import calculate_analytics
from schemas.response_schema import AnalyticsResponse
from dependencies.auth import verify_ai_api_key

router = APIRouter()

@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=AnalyticsResponse)
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

    prediction = predict_radiation(df)

    analytics = calculate_analytics(prediction)

    return analytics