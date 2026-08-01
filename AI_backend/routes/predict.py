from fastapi import APIRouter

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation

router = APIRouter()

@router.get("/predict")
def predict(
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

    from services.recommendation import generate_recommendation
    recommendation = generate_recommendation(prediction)
    return {
        "latitude": latitude,
        "longitude": longitude,

        "predicted_radiation": round(prediction, 2),
        "unit": "kWh/m²/day",

        "estimated_energy": recommendation["energy"],
        "energy_unit": "kWh/day",

        "estimated_savings": recommendation["saving"],
        "currency": "INR",

        "status": recommendation["status"],
        
        "recommendation": recommendation["message"]
    }