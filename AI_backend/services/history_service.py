import pandas as pd

from services.nasa_service import get_nasa_weather


def get_history(
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

    parameters = weather.get("properties", {}).get("parameter", {})

    radiation = parameters.get("ALLSKY_SFC_SW_DWN", {})
    temperature = parameters.get("T2M", {})
    humidity = parameters.get("RH2M", {})
    wind_speed = parameters.get("WS2M", {})

    history = []

    dates = sorted(radiation.keys())

    for date in dates:

        history.append({
            "date": date,
            "radiation": round(
                float(radiation.get(date, 0)),
                2
            ),
            "temperature": round(
                float(temperature.get(date, 0)),
                2
            ),
            "humidity": round(
                float(humidity.get(date, 0)),
                2
            ),
            "wind_speed": round(
                float(wind_speed.get(date, 0)),
                2
            )
        })

    total_radiation = sum(
        item["radiation"]
        for item in history
    )

    average_radiation = (
        total_radiation / len(history)
        if history
        else 0
    )

    max_radiation = max(
        [item["radiation"] for item in history],
        default=0
    )

    min_radiation = min(
        [item["radiation"] for item in history],
        default=0
    )

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "summary": {
            "total_radiation": round(total_radiation, 2),
            "average_radiation": round(average_radiation, 2),
            "maximum_radiation": round(max_radiation, 2),
            "minimum_radiation": round(min_radiation, 2),
            "days": len(history)
        },

        "history": history
    }