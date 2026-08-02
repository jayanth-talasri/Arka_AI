def solar_score(prediction):

    score = min(
        100,
        round((prediction / 7) * 100)
    )

    if score < 20:

        grade = "E"
        status = "Very Poor"

    elif score < 40:

        grade = "D"
        status = "Poor"

    elif score < 60:

        grade = "C"
        status = "Average"

    elif score < 80:

        grade = "B"
        status = "Good"

    else:

        grade = "A"
        status = "Excellent"

    return {

        "solar_score": score,

        "grade": grade,

        "status": status
    }