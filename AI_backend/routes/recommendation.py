from fastapi import APIRouter, Depends

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.appliance_service import appliance_schedule
from schemas.response_schema import  RecommdationResponse

from dependencies.auth import verify_ai_api_key
router = APIRouter()

@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=RecommdationResponse)
def recommendation(
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

    return appliance_schedule(prediction) 