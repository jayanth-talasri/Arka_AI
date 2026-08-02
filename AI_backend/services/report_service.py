def monthly_report(prediction):

    daily_energy = prediction * 5

    monthly_energy = daily_energy * 30

    yearly_energy = daily_energy * 365

    monthly_saving = monthly_energy * 8

    yearly_saving = yearly_energy * 8

    return {

        "month":"Current",

        "energy_generated": round(monthly_energy,2),

        "money_saved": round(monthly_saving,2),

        "yearly_energy": round(yearly_energy,2),

        "yearly_saving": round(yearly_saving,2),

        "best_day":"Highest Radiation Day",

        "worst_day":"Lowest Radiation Day"

    }