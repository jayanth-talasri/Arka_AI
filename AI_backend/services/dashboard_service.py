import numpy as np
from fastapi import HTTPException
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.prediction_service import predict_radiation
from services.recommendation import generate_recommendation
from services.analytics_service import calculate_analytics
from services.weather_service import weather_summary
from services.savings_service import calculate_savings
from services.appliance_service import appliance_schedule
def dashboard(latitude, longitude, start, end):
    weather_json = get_nasa_weather(latitude, longitude, start, end)
    df = nasa_json_to_dataframe(weather_json)
    if df.empty:
        raise HTTPException(status_code=422, detail="No NASA weather records available for the selected dates.")
    df = df.copy()
    numeric_columns = ["radiation", "temperature", "humidity", "wind_speed"]
    for column in numeric_columns:
        df[column] = np.asarray(df[column], dtype=float)
        df[column] = df[column].replace([-999, -999.0], np.nan)
    valid_radiation_df = df[
        df["radiation"].notna() &
        np.isfinite(df["radiation"]) &
        (df["radiation"] >= 0)
    ].copy()
    if valid_radiation_df.empty:
        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "prediction": {
                "predicted_radiation": None,
                "unit": "kWh/m²/day"
            },
            "weather": {
                "temperature": None,
                "humidity": None,
                "wind_speed": None,
                "condition": "Data unavailable"
            },
            "recommendation": {
                "status": "Unavailable",
                "energy": 0,
                "saving": 0,
                "message": "NASA solar radiation data is not available for the selected dates."
            },
            "analytics": {},
            "savings": {},
            "appliances": {
                "status": "Unavailable",
                "best_time": "Not available",
                "recommended": []
            }
        }
    prediction_df = valid_radiation_df.dropna(subset=["temperature", "humidity", "wind_speed"]).copy()
    if prediction_df.empty:
        raise HTTPException(status_code=422, detail="Insufficient valid weather data to generate a radiation prediction.")
    prediction = predict_radiation(prediction_df)
    average_radiation = float(valid_radiation_df["radiation"].mean())
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
        "analytics": calculate_analytics(valid_radiation_df),
        "savings": calculate_savings(valid_radiation_df),
        "appliances": appliance_schedule(average_radiation)
    }