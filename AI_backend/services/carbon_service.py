
import math


PERFORMANCE_RATIO = 0.80
CO2_FACTOR = 0.82

# Existing environmental conversion assumptions
TREE_ABSORPTION_PER_YEAR = 15.7
COAL_CONVERSION_FACTOR = 0.42
PETROL_CONVERSION_FACTOR = 0.39


def carbon_impact(
    radiation,
    solar_capacity,
    electricity_rate=8.0,
    source="NASA POWER",
    status="actual"
):
    radiation = float(radiation)
    solar_capacity = float(solar_capacity)
    electricity_rate = float(electricity_rate)

    if not math.isfinite(radiation) or radiation < 0:
        raise ValueError("Invalid solar radiation value.")

    if not math.isfinite(solar_capacity) or solar_capacity <= 0:
        raise ValueError("Solar capacity must be greater than zero.")

    if not math.isfinite(electricity_rate) or electricity_rate < 0:
        raise ValueError("Invalid electricity rate.")

    # Estimated daily solar energy generation
    daily_energy = (
        radiation
        * solar_capacity
        * PERFORMANCE_RATIO
    )

    # Electricity bill savings
    daily_saving = daily_energy * electricity_rate

    # Daily CO2 emissions avoided
    daily_co2_saved = daily_energy * CO2_FACTOR

    # Annualized estimates based on this selected day's performance
    yearly_energy = daily_energy * 365
    yearly_co2_saved = daily_co2_saved * 365
    yearly_saving = daily_saving * 365

    # Environmental equivalents
    trees_equivalent = (
        yearly_co2_saved / TREE_ABSORPTION_PER_YEAR
    )

    coal_saved = daily_co2_saved * COAL_CONVERSION_FACTOR
    petrol_saved = daily_co2_saved * PETROL_CONVERSION_FACTOR

    return {
        "radiation": round(radiation, 2),
        "radiation_unit": "kWh/m2/day",

        "solar_capacity": round(solar_capacity, 2),
        "solar_capacity_unit": "kWp",

        "performance_ratio": PERFORMANCE_RATIO,

        "daily_energy": round(daily_energy, 2),
        "yearly_energy": round(yearly_energy, 2),

        "daily_saving": round(daily_saving, 2),
        "yearly_saving": round(yearly_saving, 2),

        "daily_co2_saved": round(daily_co2_saved, 2),
        "yearly_co2_saved": round(yearly_co2_saved, 2),

        "trees_equivalent": round(trees_equivalent, 2),
        "coal_saved": round(coal_saved, 2),
        "petrol_saved": round(petrol_saved, 2),

        "source": source,
        "status": status
    }