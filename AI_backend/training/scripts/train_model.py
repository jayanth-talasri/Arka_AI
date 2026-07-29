import os
import joblib
import pandas as pd

from sklearn.preprocessing import MinMaxScaler

from keras.models import Sequential
from keras.layers import LSTM, Dense


# -----------------------------
# Load Dataset
# -----------------------------

df = pd.read_csv("dataset.csv")


# Example Features

X = df[[
    "radiation",
    "temperature",
    "humidity",
    "wind_speed"
]]

y = df["solar_generation"]


# -----------------------------
# Scaling
# -----------------------------

scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_X.fit_transform(X)

y_scaled = scaler_y.fit_transform(
    y.values.reshape(-1,1)
)


# -----------------------------
# Convert to Sequences
# -----------------------------

time_steps = 7

X_train = []
y_train = []

for i in range(len(X_scaled)-time_steps):

    X_train.append(
        X_scaled[i:i+time_steps]
    )

    y_train.append(
        y_scaled[i+time_steps]
    )


import numpy as np

X_train = np.array(X_train)
y_train = np.array(y_train)


# -----------------------------
# Build LSTM
# -----------------------------

model = Sequential()

model.add(
    LSTM(
        64,
        input_shape=(time_steps,4)
    )
)

model.add(Dense(32,activation="relu"))

model.add(Dense(1))

model.compile(
    optimizer="adam",
    loss="mse"
)


# -----------------------------
# Train
# -----------------------------

model.fit(
    X_train,
    y_train,
    epochs=30,
    batch_size=32
)


# -----------------------------
# Save Everything
# -----------------------------

os.makedirs("training/models",exist_ok=True)

model.save("training/models/Solar_lstm.keras")

joblib.dump(
    scaler_X,
    "training/models/scaler_X.pkl"
)

joblib.dump(
    scaler_y,
    "training/models/scaler_y.pkl"
)

print("Model Saved Successfully")