from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.weather_service import weather_summary
from services.insights_service import generate_insights

router = APIRouter()

@router.get("/insights")
def insights(
        latitude: float,
        longitude: float,
        start: str,
        end: str
):

    weather_json = get_nasa_weather(
        latitude,
        longitude,
        start,
        end
    )

    df = nasa_json_to_dataframe(weather_json)

    prediction = predict_radiation(df)

    weather = weather_summary(df)

    return generate_insights(
        prediction,
        weather
    )