def weather_summary(df):

    latest = df.iloc[-1]

    return {

        "temperature": round(latest["temperature"],2),

        "humidity": round(latest["humidity"],2),

        "wind_speed": round(latest["wind_speed"],2),

        "condition":

        "Sunny"

        if latest["temperature"] > 28

        else "Cloudy"

    }