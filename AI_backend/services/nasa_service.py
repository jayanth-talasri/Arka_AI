import requests
BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
def get_nasa_weather(latitude, longitude, start, end):
    params = {
        "parameters": "ALLSKY_SFC_SW_DWN,T2M,RH2M,WS2M",
        "community": "RE",
        "longitude": longitude,
        "latitude": latitude,
        "start": start,
        "end": end,
        "format": "JSON"
    }
    try:
        print("\n========== NASA POWER REQUEST ==========")
        print("Latitude:", latitude)
        print("Longitude:", longitude)
        print("Start:", start)
        print("End:", end)
        response = requests.get(BASE_URL, params=params, timeout=30)
        print("Request URL:", response.url)
        print("HTTP Status:", response.status_code)
        response.raise_for_status()
        data = response.json()
        if "properties" not in data or "parameter" not in data["properties"]:
            raise ValueError(f"Unexpected NASA POWER response: {data}")
        parameters = data["properties"]["parameter"]
        print("NASA PARAMETERS RECEIVED:")
        for name, values in parameters.items():
            print(name, values)
        print("========================================\n")
        return data
    except requests.exceptions.Timeout as error:
        raise RuntimeError("NASA POWER request timed out.") from error
    except requests.exceptions.HTTPError as error:
        raise RuntimeError(f"NASA POWER HTTP error: {error}") from error
    except requests.exceptions.RequestException as error:
        raise RuntimeError(f"NASA POWER connection failed: {error}") from error
    except ValueError as error:
        raise RuntimeError(f"NASA POWER returned invalid data: {error}") from error