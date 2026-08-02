from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.savings_service import calculate_savings
from schemas.response_schema import SavingsResponse

router = APIRouter()


@router.get("/savings", response_model=SavingsResponse)
def savings(
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

    return calculate_savings(prediction)