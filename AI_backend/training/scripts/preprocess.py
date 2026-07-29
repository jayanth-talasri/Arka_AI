import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

print("Loading merged dataset...")

df = pd.read_csv("../data/merged/solar_dataset.csv")

print(df.head())

print("\nDataset Shape:")
print(df.shape)

# ----------------------------------------------------
# Create Date column from YEAR MO DY
# ----------------------------------------------------

df["date"] = pd.to_datetime(
    dict(
        year=df["YEAR"],
        month=df["MO"],
        day=df["DY"]
    )
)

# ----------------------------------------------------
# Sort Data
# ----------------------------------------------------

df = df.sort_values("date")

# ----------------------------------------------------
# Rename Columns
# ----------------------------------------------------

df = df.rename(columns={
    "ALLSKY_SFC_SW_DWN": "radiation",
    "T2M": "temperature",
    "RH2M": "humidity",
    "WS10M": "wind_speed"
})

# ----------------------------------------------------
# Keep only required columns
# ----------------------------------------------------

df = df[
    [
        "date",
        "radiation",
        "temperature",
        "humidity",
        "wind_speed"
    ]
]

print("\nProcessed Dataset")

print(df.head())

# ----------------------------------------------------
# Features
# ----------------------------------------------------

X = df[
    [
        "temperature",
        "humidity",
        "wind_speed"
    ]
]

y = df["radiation"]

# ----------------------------------------------------
# Scaling
# ----------------------------------------------------

scaler_x = MinMaxScaler()

scaler_y = MinMaxScaler()

X_scaled = scaler_x.fit_transform(X)

y_scaled = scaler_y.fit_transform(
    y.values.reshape(-1,1)
)

# ----------------------------------------------------
# Save Scalers
# ----------------------------------------------------

os.makedirs("../artifacts", exist_ok=True)

joblib.dump(
    scaler_x,
    "../artifacts/scaler_x.pkl"
)

joblib.dump(
    scaler_y,
    "../artifacts/scaler_y.pkl"
)

print("\nScalers Saved Successfully")

# ----------------------------------------------------
# Save Processed Dataset
# ----------------------------------------------------

processed = pd.DataFrame(
    X_scaled,
    columns=[
        "temperature",
        "humidity",
        "wind_speed"
    ]
)

processed["radiation"] = y_scaled

processed.to_csv(
    "../data/processed/processed_dataset.csv",
    index=False
)

print("\nProcessed Dataset Saved")