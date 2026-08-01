import joblib
import numpy as np
import pandas as pd

from tensorflow.keras.models import load_model

MODEL = load_model("training/model/Solar_lstm.keras")

SCALER_X = joblib.load("training/model/scaler_x.pkl")

SCALER_Y = joblib.load("training/model/scaler_y.pkl")


def predict_radiation(df):

    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["dayofyear"] = df["date"].dt.dayofyear

    df["previous_radiation"] = (
        df["radiation"].shift(1)
    )

    df = df.dropna()

    features = df[
        [
            "month",
            "day",
            "dayofyear",
            "temperature",
            "humidity",
            "wind_speed",
            "previous_radiation",
        ]
    ]

    x = SCALER_X.transform(features)

    x = np.array(x)

    x = x[-7:]

    x = x.reshape(1, 7, 7)

    prediction = MODEL.predict(x, verbose=0)

    prediction = SCALER_Y.inverse_transform(prediction)

    return float(prediction[0][0])