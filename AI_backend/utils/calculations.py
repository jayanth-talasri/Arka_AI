def calculate_energy(radiation, panel_area=20, efficiency=0.20):
    """
    Estimate daily solar energy generation.

    Formula:
    Energy = Radiation × Panel Area × Efficiency
    """
    return round(radiation * panel_area * efficiency, 2)


def calculate_savings(energy, electricity_rate=8):
    """
    Estimate daily savings.

    electricity_rate = ₹/kWh
    """
    return round(energy * electricity_rate, 2)