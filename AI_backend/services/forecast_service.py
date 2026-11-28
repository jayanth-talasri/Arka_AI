
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import HTTPException

from services.live_weather_service import get_seven_day_live_weather
from services.live_prediction_service import predict_live_radiation
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe

from utils.calculations import (
    calculate_energy,
    calculate_savings
)


def seven_day_forecast(
    latitude,
    longitude,
    start,
    end
):
    # --------------------------------------------------
    # 1. Parse selected anchor date
    # --------------------------------------------------
    anchor_date = None

    for date_format in ("%Y%m%d", "%Y-%m-%d"):
        try:
            anchor_date = datetime.strptime(
                str(end),
                date_format
            ).date()

            break

        except ValueError:
            continue

    if anchor_date is None:
        raise HTTPException(
            status_code=422,
            detail="Invalid forecast date. Use YYYYMMDD or YYYY-MM-DD."
        )

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).date()

    if anchor_date < today:
        raise HTTPException(
            status_code=422,
            detail=(
                "Seven-day weather forecasts require today's date "
                "or a future forecast reference date."
            )
        )

    # --------------------------------------------------
    # 2. Calculate seven forecast dates
    # --------------------------------------------------
    first_target = anchor_date + timedelta(days=1)
    last_target = anchor_date + timedelta(days=7)

    # --------------------------------------------------
    # 3. Retrieve Open-Meteo forecast weather
    # --------------------------------------------------
    weather_data = get_seven_day_live_weather(
        latitude,
        longitude,
        first_target.isoformat(),
        last_target.isoformat()
    )

    if not weather_data:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve seven-day Open-Meteo weather data."
        )

    # --------------------------------------------------
    # 4. Retrieve only completed NASA historical days
    # --------------------------------------------------
    history_end = today - timedelta(days=1)
    history_start = history_end - timedelta(days=44)

    nasa_data = get_nasa_weather(
        latitude,
        longitude,
        history_start.strftime("%Y%m%d"),
        history_end.strftime("%Y%m%d")
    )

    shared_history = nasa_json_to_dataframe(
        nasa_data
    )

    if shared_history is None or shared_history.empty:
        raise HTTPException(
            status_code=422,
            detail="No historical NASA records available for forecast prediction."
        )

    # --------------------------------------------------
    # 5. Generate seven daily predictions
    # --------------------------------------------------
    forecast = []

    for day in range(1, 8):

        target_date = anchor_date + timedelta(days=day)
        date_string = target_date.isoformat()

        try:
            live_weather = weather_data.get(
                date_string
            )

            if live_weather is None:
                raise ValueError(
                    f"Open-Meteo weather data is unavailable for {date_string}."
                )

            radiation = predict_live_radiation(
                latitude,
                longitude,
                date_string,
                live_weather,
                history_df=shared_history
            )

            energy = calculate_energy(
                radiation
            )

            saving = calculate_savings(
                energy
            )

            forecast.append({
                "date": date_string,

                "predicted_radiation": round(
                    float(radiation),
                    2
                ),

                "predicted_energy": energy,
                "predicted_saving": saving,

                "radiation_unit": "kWh/m²/day",
                "energy_unit": "kWh/day",

                "source": "Open-Meteo weather + ArkaAI LSTM",
                "status": "estimated"
            })

        except Exception as error:
            raise HTTPException(
                status_code=502,
                detail=(
                    f"Forecast generation failed for "
                    f"{date_string}: {error}"
                )
            ) from error

    return forecast
