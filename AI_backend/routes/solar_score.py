from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.solar_score import solar_score
from schemas.response_schema import SolarScoreResponse


router = APIRouter()


@router.get(
    "",
    response_model=SolarScoreResponse
)
def score(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):

    weather = get_nasa_weather(
        latitude=latitude,
        longitude=longitude,
        start=start,
        end=end
    )

    df = nasa_json_to_dataframe(weather)

    prediction = predict_radiation(df)

    result = solar_score(prediction)

    return result