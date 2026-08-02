from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe

def get_history(latitude, longitude, start, end):

    weather = get_nasa_weather(
        latitude,
        longitude,
        start,
        end
    )

    df = nasa_json_to_dataframe(weather)

    return {
        "dates": df["date"].dt.strftime("%Y-%m-%d").tolist(),
        "radiation": df["radiation"].round(2).tolist(),
        "temperature": df["temperature"].round(2).tolist(),
        "humidity": df["humidity"].round(2).tolist(),
        "wind_speed": df["wind_speed"].round(2).tolist()
    }