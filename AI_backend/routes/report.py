from fastapi import APIRouter, Depends
from dependencies.auth import verify_ai_api_key

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.report_service import monthly_report

router = APIRouter( dependencies=[Depends(verify_ai_api_key)])

@router.get("", response_model=dict)
def report(
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

    return monthly_report(prediction)