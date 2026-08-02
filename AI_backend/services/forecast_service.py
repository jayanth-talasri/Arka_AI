from datetime import timedelta

import pandas as pd

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation


def seven_day_forecast(
        latitude,
        longitude,
        start,
        end
):

    weather = get_nasa_weather(
        latitude,
        longitude,
        start,
        end
    )

    df = nasa_json_to_dataframe(weather)

    prediction = predict_radiation(df)

    last_date = pd.to_datetime(end)

    forecast = []

    for i in range(1, 8):

        forecast.append({

            "date": (
                last_date +
                timedelta(days=i)
            ).strftime("%Y-%m-%d"),

            "predicted_radiation": round(
                prediction + (i * 0.05),
                2
            )
        })

    return forecast