from utils.calculations import calculate_energy, calculate_savings

def generate_recommendation(prediction):

    energy = calculate_energy(prediction)
    savings = calculate_savings(energy)

    if prediction >= 6:
        status = "Excellent"
        message = "Maximum solar generation expected. Run heavy appliances between 11 AM and 2 PM."

    elif prediction >= 5:
        status = "Good"
        message = "Good solar production. Suitable for EV charging and washing machine."

    elif prediction >= 4:
        status = "Average"
        message = "Moderate production. Use electricity wisely."

    else:
        status = "Poor"
        message = "Low solar generation expected. Reduce heavy appliance usage."

    return {
        "status": status,
        "energy": energy,
        "saving": savings,
        "message": message
    }