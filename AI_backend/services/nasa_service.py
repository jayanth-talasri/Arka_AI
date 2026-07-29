import requests

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"


def get_nasa_weather(latitude, longitude, start, end):

    params = {

        "parameters":"ALLSKY_SFC_SW_DWN,T2M,RH2M,WS2M",

        "community":"RE",

        "longitude":longitude,

        "latitude":latitude,

        "start":start,

        "end":end,

        "format":"JSON"

    }

    response=requests.get(BASE_URL,params=params)

    return response.json()