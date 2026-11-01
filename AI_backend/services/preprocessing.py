import pandas as pd
def nasa_json_to_dataframe(nasa_data):
    try:
        params = nasa_data["properties"]["parameter"]
        required = ["ALLSKY_SFC_SW_DWN", "T2M", "RH2M", "WS2M"]
        for name in required:
            if name not in params:
                raise ValueError(f"NASA response missing parameter: {name}")
        radiation = params["ALLSKY_SFC_SW_DWN"]
        temperature = params["T2M"]
        humidity = params["RH2M"]
        wind = params["WS2M"]
        rows = []
        for date in radiation:
            rows.append({
                "date": pd.to_datetime(date, format="%Y%m%d"),
                "radiation": radiation[date],
                "temperature": temperature.get(date, -999),
                "humidity": humidity.get(date, -999),
                "wind_speed": wind.get(date, -999)
            })
        df = pd.DataFrame(rows)
        if df.empty:
            raise ValueError("NASA returned no weather records.")
        for column in ["radiation", "temperature", "humidity", "wind_speed"]:
            df[column] = pd.to_numeric(df[column], errors="coerce")
        print("\n========== PREPROCESSING WEATHER DEBUG ==========")
        print(df.tail(5).to_string(index=False))
        print("=================================================\n")
        return df
    except (KeyError, TypeError) as error:
        raise ValueError(f"Unable to process NASA POWER response: {error}") from error