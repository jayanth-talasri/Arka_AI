import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from tensorflow.keras.models import load_model

TIME_STEPS = 30

FEATURES = [
    "month",
    "day",
    "dayofyear",
    "season",
    "temperature",
    "humidity",
    "wind_speed",
    "previous_radiation"
]

df = pd.read_csv(
    "training/data/processed/processed_dataset.csv"
)

X = df[FEATURES]

y = df[["radiation"]]

scaler_x = joblib.load(
    "training/model/scaler_x.pkl"
)

scaler_y = joblib.load(
    "training/model/scaler_y.pkl"
)

X = scaler_x.transform(X)
y = scaler_y.transform(y)

X_seq = []
y_seq = []

for i in range(len(X)-TIME_STEPS):

    X_seq.append(
        X[i:i+TIME_STEPS]
    )

    y_seq.append(
        y[i+TIME_STEPS]
    )

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

model = load_model(
    "training/model/Solar_lstm.keras"
)

pred = model.predict(X_seq)

pred = scaler_y.inverse_transform(pred)

actual = scaler_y.inverse_transform(y_seq)

print()

print("MAE :", mean_absolute_error(actual,pred))

print()

print("RMSE :", np.sqrt(mean_squared_error(actual,pred)))

print()

print("R2 :", r2_score(actual,pred))