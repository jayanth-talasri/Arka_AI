import numpy as np
def calculate_savings(df, solar_capacity=5.0, electricity_rate=8.0, performance_ratio=0.8):
    valid_radiation = df["radiation"].dropna().astype(float)
    valid_radiation = valid_radiation[np.isfinite(valid_radiation) & (valid_radiation >= 0)]
    if valid_radiation.empty:
        raise ValueError("No valid radiation records available for savings calculation.")
    daily_energies = valid_radiation * solar_capacity * performance_ratio
    period_energy = float(daily_energies.sum())
    average_daily_energy = float(daily_energies.mean())
    weekly_energy_estimate = average_daily_energy * 7
    monthly_energy_estimate = average_daily_energy * 30
    yearly_energy_estimate = average_daily_energy * 365
    period_saving = period_energy * electricity_rate
    daily_saving = average_daily_energy * electricity_rate
    weekly_saving = weekly_energy_estimate * electricity_rate
    monthly_saving = monthly_energy_estimate * electricity_rate
    yearly_saving = yearly_energy_estimate * electricity_rate
    return {
        "period_energy": round(period_energy, 2),
        "period_saving": round(period_saving, 2),
        "daily_energy": round(average_daily_energy, 2),
        "weekly_energy": round(weekly_energy_estimate, 2),
        "monthly_energy": round(monthly_energy_estimate, 2),
        "yearly_energy": round(yearly_energy_estimate, 2),
        "daily_saving": round(daily_saving, 2),
        "weekly_saving": round(weekly_saving, 2),
        "monthly_saving": round(monthly_saving, 2),
        "yearly_saving": round(yearly_saving, 2),
        "lifetime_saving": round(yearly_saving * 25, 2)
    }
