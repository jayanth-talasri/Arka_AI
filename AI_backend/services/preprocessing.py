import pandas as pd

def nasa_json_to_dataframe(nasa_data):

    params = nasa_data["properties"]["parameter"]

    radiation = params["ALLSKY_SFC_SW_DWN"]
    temperature = params["T2M"]
    humidity = params["RH2M"]
    wind = params["WS2M"]

    rows = []

    for date in radiation.keys():

        rows.append({
            "date": pd.to_datetime(date),
            "radiation": radiation[date],
            "temperature": temperature[date],
            "humidity": humidity[date],
            "wind_speed": wind[date]
        })

    return pd.DataFrame(rows)