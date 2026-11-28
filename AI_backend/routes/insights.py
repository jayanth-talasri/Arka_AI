
from fastapi import APIRouter, Depends, HTTPException

from dependencies.auth import verify_ai_api_key
from services.solar_data_service import get_solar_data
from services.prediction_service import predict_radiation
from services.weather_service import weather_summary
from services.insights_service import generate_insights


router = APIRouter(
    dependencies=[Depends(verify_ai_api_key)]
)


@router.get("", response_model=dict)
def insights(
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

        # Generate the radiation prediction.
        prediction = predict_radiation(solar_df)

        # Prepare weather information from the validated data.
        weather = weather_summary(solar_df)

        # Generate AI insights.
        result = generate_insights(
            prediction,
            weather
        )

        print(
            "AI INSIGHTS SUCCESS:",
            result
        )

        return result

    except ValueError as error:
        print("AI INSIGHTS DATA ERROR:", str(error))

        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    except Exception as error:
        print("AI INSIGHTS ROUTE ERROR:", str(error))

        raise HTTPException(
            status_code=502,
            detail="Unable to generate AI insights: " + str(error)
        )
