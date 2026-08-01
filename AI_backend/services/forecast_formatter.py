from datetime import datetime
from datetime import timedelta

from services.recommendation import generate_recommendation

def build_forecast(predictions):

    forecast = []

    today = datetime.today()

    for i, prediction in enumerate(predictions):

        recommendation = generate_recommendation(prediction)

        forecast.append({

            "date": (today + timedelta(days=i+1)).strftime("%Y-%m-%d"),

            "predicted_radiation": prediction,

            "estimated_energy": recommendation["energy"],

            "estimated_savings": recommendation["saving"],

            "status": recommendation["status"],

            "recommendation": recommendation["message"]

        })

    return forecast