from fastapi import APIRouter, Depends, HTTPException

from dependencies.auth import verify_ai_api_key
from services.solar_data_service import get_solar_data
from services.prediction_service import predict_radiation
from services.solar_score import solar_score
from schemas.response_schema import SolarScoreResponse

router = APIRouter(
    dependencies=[Depends(verify_ai_api_key)]
)

@router.get("", response_model=SolarScoreResponse)
def score(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    try:
        # NASA POWER first, Open-Meteo fallback for missing values.
        solar_df = get_solar_data(
            latitude=latitude,
            longitude=longitude,
            start=start,
            end=end,
            required_columns=[
                "radiation",
                "temperature",
                "humidity",
                "wind_speed"
            ]
        )

        # Predict radiation using the prepared weather data.
        prediction = predict_radiation(solar_df)

        # Calculate the solar performance score.
        result = solar_score(prediction)

        print(
            "SOLAR SCORE SUCCESS:",
            result
        )

        return result

    except ValueError as error:
        print("SOLAR SCORE DATA ERROR:", str(error))

        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    except Exception as error:
        print("SOLAR SCORE ROUTE ERROR:", str(error))

        raise HTTPException(
            status_code=502,
            detail="Unable to calculate solar score: " + str(error)
        )
