def calculate_analytics(predicted_radiation: float):

    panel_capacity = 5

    daily_energy = predicted_radiation * panel_capacity

    monthly_energy = daily_energy * 30

    yearly_energy = daily_energy * 365

    daily_saving = daily_energy * 8

    monthly_saving = monthly_energy * 8

    yearly_saving = yearly_energy * 8

    co2_saved = daily_energy * 0.82

    trees = yearly_energy / 7000

    efficiency = (predicted_radiation / 7) * 100

    return {

        "daily_energy": round(daily_energy,2),

        "monthly_energy": round(monthly_energy,2),

        "yearly_energy": round(yearly_energy,2),

        "daily_saving": round(daily_saving,2),

        "monthly_saving": round(monthly_saving,2),

        "yearly_saving": round(yearly_saving,2),

        "co2_saved": round(co2_saved,2),

        "trees_equivalent": round(trees,2),

        "panel_efficiency": round(efficiency,2)

    }