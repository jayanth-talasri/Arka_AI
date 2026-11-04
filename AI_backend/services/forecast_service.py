
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from services.live_weather_service import get_seven_day_live_weather
from services.live_prediction_service import predict_live_radiation
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from utils.calculations import calculate_energy, calculate_savings


def seven_day_forecast(latitude, longitude, start, end):
    try:
        try:
            anchor_date = datetime.strptime(str(end), "%Y%m%d").date()
        except ValueError:
            anchor_date = datetime.strptime(str(end), "%Y-%m-%d").date()

    except ValueError as error:
        raise ValueError(
            "Invalid forecast end date. Use YYYYMMDD or YYYY-MM-DD."
        ) from error

    today = datetime.now(ZoneInfo("Asia/Kolkata")).date()

    if anchor_date < today:
        raise ValueError(
            "Seven-day weather forecasts require today's date or a future forecast reference date."
        )

    first_target = anchor_date + timedelta(days=1)
    last_target = anchor_date + timedelta(days=7)

    # Fetch all seven days of Open-Meteo weather in one request.
    weather_data = get_seven_day_live_weather(
        latitude,
        longitude,
        first_target.isoformat(),
        last_target.isoformat()
    )

    # Fetch the complete shared NASA historical range in one request.
    nasa_start = (first_target - timedelta(days=45)).strftime("%Y%m%d")
    nasa_end = (last_target - timedelta(days=1)).strftime("%Y%m%d")

    nasa_data = get_nasa_weather(
        latitude,
        longitude,
        nasa_start,
        nasa_end
    )

    shared_history = nasa_json_to_dataframe(nasa_data)

    forecast = []

    for day in range(1, 8):
        target_date = anchor_date + timedelta(days=day)
        date_string = target_date.isoformat()

        try:
            live_weather = weather_data.get(date_string)

            if live_weather is None:
                raise ValueError(
                    f"Open-Meteo weather data unavailable for {date_string}."
                )

            radiation = predict_live_radiation(
                latitude,
                longitude,
                date_string,
                live_weather,
                history_df=shared_history
            )

            energy = calculate_energy(radiation)
            saving = calculate_savings(energy)

            forecast.append({
                "date": date_string,
                "predicted_radiation": round(float(radiation), 2),
                "predicted_energy": energy,
                "predicted_saving": saving,
                "radiation_unit": "kWh/m┬▓/day",
                "energy_unit": "kWh/day",
                "source": "Open-Meteo weather + ArkaAI LSTM",
                "status": "estimated"
            })

        except Exception as error:
            raise RuntimeError(
                f"Forecast generation failed for {date_string}: {error}"
            ) from error

    return forecast
