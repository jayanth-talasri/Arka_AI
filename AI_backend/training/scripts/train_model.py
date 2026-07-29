import os
import joblib
import numpy as np
import pandas as pd

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

from sklearn.model_selection import train_test_split

# -----------------------------
# Load Dataset
# -----------------------------

print("Loading processed dataset...")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "processed",
    "processed_dataset.csv"
)

df = pd.read_csv(DATA_PATH)

print(df.head())

# -----------------------------
# Load Scalers
# -----------------------------

scaler_x = joblib.load(
    os.path.join(BASE_DIR, "scaler", "scaler_x.pkl")
)

scaler_y = joblib.load(
    os.path.join(BASE_DIR, "scaler", "scaler_y.pkl")
)

# -----------------------------
# Features
# -----------------------------

X = df[
    [
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ]
].values

y = df["radiation"].values.reshape(-1, 1)

# -----------------------------
# Scale
# -----------------------------

X_scaled = scaler_x.transform(X)

y_scaled = scaler_y.transform(y)

# -----------------------------
# Sequence Length
# -----------------------------

sequence_length = 7

X_sequences = []

y_sequences = []

for i in range(sequence_length, len(X_scaled)):

    X_sequences.append(
        X_scaled[i-sequence_length:i]
    )

    y_sequences.append(
        y_scaled[i]
    )

X_sequences = np.array(X_sequences)

y_sequences = np.array(y_sequences)

print()

print("Input Shape:", X_sequences.shape)

print("Output Shape:", y_sequences.shape)

# -----------------------------
# Train Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_sequences,
    y_sequences,
    test_size=0.2,
    random_state=42
)

# -----------------------------
# Build LSTM
# -----------------------------

model = Sequential()

model.add(
    LSTM(
        64,
        return_sequences=True,
        input_shape=(sequence_length, 4)
    )
)

model.add(
    Dropout(0.2)
)

model.add(
    LSTM(32)
)

model.add(
    Dropout(0.2)
)

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

# -----------------------------
# Early Stopping
# -----------------------------

early_stop = EarlyStopping(

    monitor="val_loss",

    patience=10,

    restore_best_weights=True

)

# -----------------------------
# Train
# -----------------------------

history = model.fit(

    X_train,

    y_train,

    validation_data=(X_test, y_test),

    epochs=50,

    batch_size=32,

    callbacks=[early_stop]

)

# -----------------------------
# Save Model
# -----------------------------

MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "Solar_lstm.keras"
)

model.save(MODEL_PATH)

print()

print("Model Saved Successfully")

print(MODEL_PATH)