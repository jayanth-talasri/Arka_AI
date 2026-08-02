from services.recommendation import generate_recommendation

def generate_insights(prediction, weather):

    recommendation = generate_recommendation(prediction)

    insights = []

    # Solar Production
    if prediction >= 5.5:
        insights.append(
            "Excellent solar production expected tomorrow."
        )
    elif prediction >= 4:
        insights.append(
            "Moderate solar generation is expected."
        )
    else:
        insights.append(
            "Low solar production expected."
        )

    # Temperature
    if weather["temperature"] > 35:
        insights.append(
            "High temperature may slightly reduce panel efficiency."
        )
    else:
        insights.append(
            "Temperature is favorable for solar generation."
        )

    # Humidity
    if weather["humidity"] > 80:
        insights.append(
            "High humidity may reduce solar efficiency."
        )
    else:
        insights.append(
            "Humidity levels are within the normal range."
        )

    insights.append(
        "Best appliance usage: 11 AM - 2 PM."
    )

    insights.append(
        recommendation["message"]
    )

    return {
        "insights": insights
    }