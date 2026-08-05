from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.carbon_service import carbon_impact

router = APIRouter()

@router.get("",)
def carbon(
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

    return carbon_impact(prediction)