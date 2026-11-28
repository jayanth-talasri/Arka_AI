import numpy as np
from utils.calculations import calculate_energy, calculate_savings
def calculate_analytics(df):
    valid_radiation = df["radiation"].dropna().astype(float)
    valid_radiation = valid_radiation[np.isfinite(valid_radiation) & (valid_radiation >= 0)]
    if valid_radiation.empty:
        raise ValueError("No valid radiation records available for analytics.")
    daily_energies = valid_radiation.apply(calculate_energy)
    period_energy = float(daily_energies.sum())
    average_daily_energy = float(daily_energies.mean())
    period_saving = calculate_savings(period_energy)
    weekly_energy = average_daily_energy * 7
    monthly_energy_estimate = average_daily_energy * 30
    yearly_energy_estimate = average_daily_energy * 365
    average_radiation = float(valid_radiation.mean())
    return {
        "period_energy": round(period_energy, 2),
        "period_saving": round(period_saving, 2),
        "daily_energy": round(average_daily_energy, 2),
        "weekly_energy": round(weekly_energy, 2),
        "monthly_energy": round(monthly_energy_estimate, 2),
        "yearly_energy": round(yearly_energy_estimate, 2),
        "daily_saving": round(calculate_savings(average_daily_energy), 2),
        "weekly_saving": round(calculate_savings(weekly_energy), 2),
        "monthly_saving": round(calculate_savings(monthly_energy_estimate), 2),
        "yearly_saving": round(calculate_savings(yearly_energy_estimate), 2),
        "co2_saved": round(period_energy * 0.82, 2),
        "trees_equivalent": round(yearly_energy_estimate / 7000, 2),
        "panel_efficiency": round((average_radiation / 7) * 100, 2)
    }