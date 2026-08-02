def calculate_savings(predicted_radiation: float):

    panel_capacity = 5

    daily_energy = predicted_radiation * panel_capacity

    monthly_energy = daily_energy * 30

    yearly_energy = daily_energy * 365

    unit_price = 8

    return {

        "daily_energy": round(daily_energy,2),

        "monthly_energy": round(monthly_energy,2),

        "yearly_energy": round(yearly_energy,2),

        "daily_saving": round(daily_energy * unit_price,2),

        "monthly_saving": round(monthly_energy * unit_price,2),

        "yearly_saving": round(yearly_energy * unit_price,2),

        "lifetime_saving": round(yearly_energy * unit_price * 25,2)

    }