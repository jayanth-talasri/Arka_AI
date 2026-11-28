
import numpy as np
import pandas as pd

from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.analytics_service import calculate_analytics
from services.live_weather_service import (
    get_historical_radiation,
    get_live_weather
)
from schemas.response_schema import AnalyticsResponse
from dependencies.auth import verify_ai_api_key


router = APIRouter()


@router.get(
    "",
    dependencies=[Depends(verify_ai_api_key)],
    response_model=AnalyticsResponse
)
def analytics(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    try:
        # -----------------------------------------
        # 1. Fetch NASA POWER data
        # -----------------------------------------

        weather = get_nasa_weather(
            latitude,
            longitude,
            start,
            end
        )

        df = nasa_json_to_dataframe(weather)

        if df.empty:
            raise HTTPException(
                status_code=422,
                detail="No NASA weather records available."
            )

        df = df.copy()

        df["radiation"] = pd.to_numeric(
            df["radiation"],
            errors="coerce"
        )

        df["radiation"] = df["radiation"].replace(
            [-999, -999.0],
            np.nan
        )

        # -----------------------------------------
        # 2. Identify invalid NASA radiation values
        # -----------------------------------------

        today = datetime.now(
            ZoneInfo("Asia/Kolkata")
        ).date()

        for index, row in df.iterrows():

            radiation = row["radiation"]

            if (
                pd.notna(radiation)
                and np.isfinite(radiation)
                and radiation >= 0
            ):
                continue

            target_date = pd.to_datetime(
                row["date"]
            ).date()

            fallback_radiation = None
            fallback_source = None

            try:

                # Past dates: Open-Meteo historical radiation
                if target_date < today:

                    fallback_radiation = get_historical_radiation(
                        latitude,
                        longitude,
                        target_date.isoformat()
                    )

                    fallback_source = "Open-Meteo Historical"

                # Today/future: Open-Meteo forecast radiation
                else:

                    live_data = get_live_weather(
                        latitude,
                        longitude,
                        target_date.isoformat()
                    )

                    fallback_radiation = live_data.get(
                        "forecast_radiation"
                    )

                    fallback_source = "Open-Meteo"

                if fallback_radiation is not None:

                    fallback_radiation = float(
                        fallback_radiation
                    )

                    if (
                        np.isfinite(fallback_radiation)
                        and fallback_radiation >= 0
                    ):

                        df.at[index, "radiation"] = (
                            fallback_radiation
                        )

                        print(
                            f"ANALYTICS FALLBACK: {target_date} | "
                            f"{fallback_source} | "
                            f"Radiation: {fallback_radiation}"
                        )

            except Exception as error:

                print(
                    f"ANALYTICS FALLBACK ERROR: "
                    f"{target_date} | {error}"
                )

        # -----------------------------------------
        # 3. Validate final radiation records
        # -----------------------------------------

        valid_mask = (
            df["radiation"].notna()
            & np.isfinite(df["radiation"])
            & (df["radiation"] >= 0)
        )

        valid_radiation_df = df[valid_mask].copy()

        if valid_radiation_df.empty:

            raise HTTPException(
                status_code=422,
                detail=(
                    "No valid solar radiation records available "
                    "from NASA POWER or Open-Meteo."
                )
            )

        if len(valid_radiation_df) != len(df):

            missing_dates = df.loc[
                ~valid_mask,
                "date"
            ].dt.strftime("%Y-%m-%d").tolist()

            raise HTTPException(
                status_code=422,
                detail={
                    "message": (
                        "Solar radiation is unavailable for some "
                        "selected dates."
                    ),
                    "missing_dates": missing_dates
                }
            )

        # -----------------------------------------
        # 4. Calculate analytics
        # -----------------------------------------

        result = calculate_analytics(
            valid_radiation_df
        )

        print(
            "ANALYTICS SUCCESS:",
            result
        )

        return result

    except HTTPException:
        raise

    except Exception as error:

        print(
            "ANALYTICS ROUTE ERROR:",
            str(error)
        )

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )
