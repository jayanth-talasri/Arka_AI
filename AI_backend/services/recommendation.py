
import math


PERFORMANCE_RATIO = 0.80


def generate_recommendation(
    prediction,
    solar_capacity=1.0,
    electricity_rate=8.0
):
    radiation = float(prediction)
    capacity = float(solar_capacity)
    tariff = float(electricity_rate)

    if not math.isfinite(radiation) or radiation < 0:
        raise ValueError("Invalid predicted radiation.")

    if not math.isfinite(capacity) or capacity <= 0:
        raise ValueError("Solar capacity must be greater than zero.")

    if not math.isfinite(tariff) or tariff < 0:
        raise ValueError("Electricity tariff must be non-negative.")

    energy = radiation * capacity * PERFORMANCE_RATIO
    savings = energy * tariff

    if radiation >= 6:
        status = "Excellent"
        message = (
            "Strong solar generation is expected. "
            "Prioritize suitable high-demand appliances "
            "during the solar operating window."
        )

    elif radiation >= 5:
        status = "Good"
        message = (
            "Good solar generation is expected. "
            "Schedule medium and suitable high-demand "
            "appliances around peak solar hours."
        )

    elif radiation >= 4:
        status = "Average"
        message = (
            "Moderate solar generation is expected. "
            "Prioritize essential and medium-demand appliances."
        )

    else:
        status = "Poor"
        message = (
            "Solar generation is expected to be limited. "
            "Prioritize low-demand appliances and avoid "
            "unnecessary heavy loads."
        )

    return {
        "status": status,
        "message": message,
        "predicted_radiation": round(radiation, 2),
        "energy": round(energy, 2),
        "saving": round(savings, 2)
    }
