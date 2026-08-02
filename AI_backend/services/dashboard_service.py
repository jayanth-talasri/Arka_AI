from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe

from services.prediction_service import predict_radiation
from services.recommendation import generate_recommendation
from services.analytics_service import calculate_analytics
from services.weather_service import weather_summary
from services.savings_service import calculate_savings
from services.appliance_service import appliance_schedule


def dashboard(latitude, longitude, start, end):

    weather_json = get_nasa_weather(
        latitude,
        longitude,
        start,
        end
    )

    df = nasa_json_to_dataframe(weather_json)

    prediction = predict_radiation(df)

    return {

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "prediction": {
            "predicted_radiation": round(prediction, 2),
            "unit": "kWh/m²/day"
        },

        "weather": weather_summary(df),

        "recommendation": generate_recommendation(prediction),

        "analytics": calculate_analytics(prediction),

        "savings": calculate_savings(prediction),

        "appliances": appliance_schedule(prediction)

    }