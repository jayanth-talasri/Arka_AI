
from fastapi import APIRouter, Depends, HTTPException

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.appliance_service import appliance_schedule

from schemas.response_schema import AppliancesResponse
from dependencies.auth import verify_ai_api_key

router = APIRouter( dependencies=[Depends(verify_ai_api_key)] )

@router.get( "", response_model=AppliancesResponse )
def appliances(
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

        print("========== APPLIANCES START ==========")
        print("Latitude:", latitude)
        print("Longitude:", longitude)
        print("Start:", start)
        print("End:", end)
        print("Solar capacity:", solar_capacity)
        print("Electricity rate:", electricity_rate)
        print("Selected appliances:", appliance_info)

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

        result = appliance_schedule(
            average_radiation=prediction,
            appliance_info=appliance_info,
            solar_capacity=solar_capacity,
            latitude=latitude,
            longitude=longitude,
            target_date=start,
            electricity_rate=electricity_rate
        )

        print("APPLIANCE RESULT:", result)

        return result

    except HTTPException:
        raise

    except Exception as error:
        print("========== APPLIANCES ERROR ==========")
        print("Error:", str(error))

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )