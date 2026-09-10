from fastapi import APIRouter, Depends

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.appliance_service import appliance_schedule
from dependencies.auth import verify_ai_api_key

router = APIRouter(
    dependencies=[Depends(verify_ai_api_key)]
)


@router.get("")
def appliances(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):

    try:

        print("========== APPLIANCES START ==========")

        print("Latitude:", latitude)
        print("Longitude:", longitude)
        print("Start:", start)
        print("End:", end)


        print("STEP 1: Getting NASA weather...")

        weather = get_nasa_weather(
            latitude,
            longitude,
            start,
            end
        )

        print("STEP 1 SUCCESS")


        print("STEP 2: Preprocessing data...")

        df = nasa_json_to_dataframe(weather)

        print("STEP 2 SUCCESS")


        print("STEP 3: Predicting radiation...")

        prediction = predict_radiation(df)

        print("Prediction:", prediction)

        print("STEP 3 SUCCESS")


        print("STEP 4: Creating appliance schedule...")

        result = appliance_schedule(prediction)

        print("Result:", result)

        print("========== APPLIANCES SUCCESS ==========")

        return result


    except Exception as e:

        print("========== APPLIANCES ERROR ==========")

        print("Error:", str(e))

        import traceback
        traceback.print_exc()

        raise