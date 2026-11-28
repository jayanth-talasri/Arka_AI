
import pandas as pd

from services.solar_data_service import get_solar_data
from utils.calculations import calculate_energy, calculate_savings


def get_history(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    """
    Retrieve historical solar and weather data using NASA POWER
    with Open-Meteo fallback for missing or invalid values.

    Calculate daily energy generation, estimated savings,
    and environmental impact.
    """

    df = get_solar_data(
        latitude=latitude,
        longitude=longitude,
        start=start,
        end=end,
        required_columns=[
            "radiation",
            "temperature",
            "humidity",
            "wind_speed"
        ]
    )

    if df.empty:
        raise ValueError("No historical records available for the selected dates.")

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])
    df = df.sort_values("date").reset_index(drop=True)

    if df.empty:
        raise ValueError("No valid historical dates were returned.")

    history = []

    for _, row in df.iterrows():
        radiation = float(row["radiation"])
        temperature = float(row["temperature"])
        humidity = float(row["humidity"])
        wind_speed = float(row["wind_speed"])

        energy = calculate_energy(radiation)
        savings = calculate_savings(energy)

        history.append({
            "date": row["date"].strftime("%Y-%m-%d"),
            "radiation": round(radiation, 2),
            "energy": energy,
            "savings": savings,
            "temperature": round(temperature, 2),
            "humidity": round(humidity, 2),
            "wind_speed": round(wind_speed, 2),
            "co2_saved": round(energy * 0.82, 2)
        })

    total_radiation = sum(item["radiation"] for item in history)
    total_energy = sum(item["energy"] for item in history)
    total_savings = sum(item["savings"] for item in history)
    total_co2_saved = sum(item["co2_saved"] for item in history)

    radiation_values = [item["radiation"] for item in history]
    energy_values = [item["energy"] for item in history]

    days = len(history)

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "data_source": "NASA POWER with Open-Meteo fallback",
        "summary": {
            "total_radiation": round(total_radiation, 2),
            "average_radiation": round(total_radiation / days, 2),
            "maximum_radiation": round(max(radiation_values), 2),
            "minimum_radiation": round(min(radiation_values), 2),
            "total_energy": round(total_energy, 2),
            "average_energy": round(total_energy / days, 2),
            "maximum_energy": round(max(energy_values), 2),
            "total_savings": round(total_savings, 2),
            "average_savings": round(total_savings / days, 2),
            "co2_saved": round(total_co2_saved, 2),
            "days": days
        },
        "history": history
    }
