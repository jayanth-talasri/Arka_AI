import numpy as np

from services.model_loader import (
    MODEL,
    SCALER_X,
    SCALER_Y
)


def predict_radiation(df):

    df = df.copy()

    # ------------------------
    # Date Features
    # ------------------------

    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["dayofyear"] = df["date"].dt.dayofyear

    # ------------------------
    # Season
    # ------------------------

    def season(month):

        if month in [12, 1, 2]:
            return 0

        elif month in [3, 4, 5]:
            return 1

        elif month in [6, 7, 8]:
            return 2

        return 3

    df["season"] = df["month"].apply(season)

    # ------------------------
    # Previous Radiation
    # ------------------------

    df["previous_radiation"] = df["radiation"].shift(1)

    df = df.bfill().ffill()

    # ------------------------
    # EXACT SAME FEATURES AS TRAINING
    # ------------------------

    features = df[
        [
            "temperature",
            "humidity",
            "wind_speed",
            "month",
            "day",
            "dayofyear",
            "season",
            "previous_radiation",
        ]
    ]

    print(features.tail())

    print("=" * 50)
    print("SCALER FEATURES")
    print(list(SCALER_X.feature_names_in_))

    print("\nINPUT FEATURES")
    print(list(features.columns))

    print("\nSCALER SHAPE")
    print(len(SCALER_X.feature_names_in_))

    print("INPUT SHAPE")
    print(len(features.columns))

    print("\nDTYPES")
    print(features.dtypes)

    print("=" * 50)

    features = features[SCALER_X.feature_names_in_]
    print(features.head())
    X = SCALER_X.transform(features)
    
    print("\nPrediction Features")
    print(features.columns.to_list())

    print("\nPrediction shape")
    print(features.shape)

    sequence = 30

    if len(X) < sequence:

        pad = np.repeat(
            X[0:1],
            sequence - len(X),
            axis=0
        )
        X = np.vstack([pad, X])

    X = X[-sequence:]
    X = X.reshape(1,sequence,X.shape[1])

    prediction = MODEL.predict(
        X,
        verbose=0
    )

    radiation = SCALER_Y.inverse_transform(prediction)

    return float(radiation[0][0])