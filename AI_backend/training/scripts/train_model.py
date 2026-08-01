import pandas as pd
import numpy as np
import os
import joblib

from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# ----------------------------
# Load Dataset
# ----------------------------

print("Loading Processed Dataset...")

df = pd.read_csv("training/data/processed/processed_dataset.csv")

print(df.head())

# ----------------------------
# Features
# ----------------------------

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

TARGET = "radiation"

X = df[FEATURES]

y = df[[TARGET]]

# ----------------------------
# Scaling
# ----------------------------

scaler_x = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_x.fit_transform(X)
y_scaled = scaler_y.fit_transform(y)

joblib.dump(scaler_x, "training/model/scaler_x.pkl")
joblib.dump(scaler_y, "training/model/scaler_y.pkl")

print("Scalers Saved")

# ----------------------------
# Create Sequences
# ----------------------------

TIME_STEPS = 30

X_seq = []
y_seq = []

for city in df["City"].unique():

    city_df = df[df["City"] == city].copy()

    city_x = scaler_x.transform(city_df[FEATURES])

    city_y = scaler_y.transform(city_df[[TARGET]])

    for i in range(len(city_df) - TIME_STEPS):

        X_seq.append(
            city_x[i:i+TIME_STEPS]
        )

        y_seq.append(
            city_y[i+TIME_STEPS]
        )

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

print("Sequence Shape:", X_seq.shape)

# ----------------------------
# Train Test Split
# ----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_seq,
    y_seq,
    test_size=0.2,
    random_state=42
)

print("Train:", X_train.shape)
print("Test :", X_test.shape)

# ----------------------------
# LSTM Model
# ----------------------------

model = Sequential()

model.add(
    LSTM(
        64,
        return_sequences=True,
        input_shape=(TIME_STEPS, len(FEATURES))
    )
)

model.add(Dropout(0.2))

model.add(
    LSTM(32)
)

model.add(Dropout(0.2))

model.add(
    Dense(16, activation="relu")
)

model.add(
    Dense(1)
)

model.compile(
    optimizer="adam",
    loss="mse",
    metrics=["mae"]
)

model.summary()

# ----------------------------
# Training
# ----------------------------

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=10,
    restore_best_weights=True
)

history = model.fit(
    X_train,
    y_train,
    validation_data=(X_test, y_test),
    epochs=50,
    batch_size=32,
    callbacks=[early_stop]
)

# ----------------------------
# Save Model
# ----------------------------

os.makedirs("training/model", exist_ok=True)

model.save(
    "training/model/Solar_lstm.keras"
)

print("Model Saved Successfully")