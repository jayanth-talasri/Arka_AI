
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from services.live_weather_service import get_live_weather
from services.live_prediction_service import predict_live_radiation
from utils.calculations import calculate_energy, calculate_savings
def seven_day_forecast(latitude, longitude, start, end):
    try:
        anchor_date = datetime.strptime(str(end), "%Y%m%d").date()
    except ValueError:
        try:
            anchor_date = datetime.strptime(str(end), "%Y-%m-%d").date()
        except ValueError as error:
            raise ValueError("Invalid forecast end date. Use YYYYMMDD or YYYY-MM-DD.") from error
    today = datetime.now(ZoneInfo("Asia/Kolkata")).date()
    if anchor_date < today:
        raise ValueError("Seven-day weather forecasts require today's date or a future forecast reference date.")
    forecast = []
    for day in range(1, 8):
        target_date = anchor_date + timedelta(days=day)
        date_string = target_date.isoformat()
        try:
            live_weather = get_live_weather(latitude, longitude, date_string)
            radiation = predict_live_radiation(latitude, longitude, date_string, live_weather)
            energy = calculate_energy(radiation)
            saving = calculate_savings(energy)
            forecast.append({
                "date": date_string,
                "predicted_radiation": round(float(radiation), 2),
                "predicted_energy": energy,
                "predicted_saving": saving,
                "radiation_unit": "kWh/m²/day",
                "energy_unit": "kWh/day",
                "source": "Open-Meteo weather + ArkaAI LSTM",
                "status": "estimated"
            })
        except Exception as error:
            raise RuntimeError(f"Forecast generation failed for {date_string}: {error}") from error
    return forecast
