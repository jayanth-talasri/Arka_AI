from fastapi import APIRouter, Depends, HTTPException

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.recommendation import generate_recommendation

from schemas.response_schema import RecommdationResponse
from dependencies.auth import verify_ai_api_key

router = APIRouter()

@router.get(
    "",
    dependencies=[Depends(verify_ai_api_key)],
    response_model=RecommdationResponse
)
def recommendation(
    latitude: float,
    longitude: float,
    start: str,
    end: str,
    solar_capacity: float = 1.0,
    electricity_rate: float = 8.0,
    appliance_info: str = ""
):
    try:
        if solar_capacity <= 0 or electricity_rate < 0:
            raise HTTPException(
                status_code=422,
                detail="Invalid solar capacity or electricity tariff."
            )

        weather = get_nasa_weather(
            latitude,
            longitude,
            start,
            end
        )

        df = nasa_json_to_dataframe(weather)

        if df is None or df.empty:
            raise HTTPException(
                status_code=422,
                detail="No NASA weather data available for the selected dates."
            )

        prediction = predict_radiation(df)

        result = generate_recommendation(
            prediction=prediction,
            solar_capacity=solar_capacity,
            electricity_rate=electricity_rate
        )

        return result

    except HTTPException:
        raise

    except Exception as error:
        print("RECOMMENDATION ROUTE ERROR:", str(error))

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )
