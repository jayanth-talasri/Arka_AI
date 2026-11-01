import os
import numpy as np
import pandas as pd

INPUT = "training/data/merged/solar_dataset.csv"
OUTPUT = "training/data/processed/processed_dataset.csv"

REQUIRED_COLUMNS = [
    "City",
    "YEAR",
    "MO",
    "DY",
    "ALLSKY_SFC_SW_DWN",
    "T2M",
    "RH2M",
    "WS10M"
]

print("Loading Dataset...")
if not os.path.exists(INPUT):
    raise FileNotFoundError(f"Input dataset not found: {INPUT}")

df = pd.read_csv(INPUT)
missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
if missing_columns:
    raise ValueError(f"Missing dataset columns: {missing_columns}")

print("Original dataset shape:", df.shape)

# Convert source measurements into numeric values.
numeric_columns = [
    "YEAR",
    "MO",
    "DY",
    "ALLSKY_SFC_SW_DWN",
    "T2M",
    "RH2M",
    "WS10M"
]
for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Convert NASA POWER missing-data sentinel values to NaN.
measurement_columns = [
    "ALLSKY_SFC_SW_DWN",
    "T2M",
    "RH2M",
    "WS10M"
]
df[measurement_columns] = df[measurement_columns].replace(
    [-999, -999.0, -9999, -9999.0],
    np.nan
)

# Create date column.
df["date"] = pd.to_datetime(
    dict(
        year=df["YEAR"],
        month=df["MO"],
        day=df["DY"]
    ),
    errors="coerce"
)

# Remove invalid dates and missing city names.
df = df.dropna(subset=["date", "City"])

# Rename NASA POWER columns.
df = df.rename(columns={
    "ALLSKY_SFC_SW_DWN": "radiation",
    "T2M": "temperature",
    "RH2M": "humidity",
    "WS10M": "wind_speed"
})

# Validate physically possible measurement ranges.
df.loc[~df["radiation"].between(0, 50), "radiation"] = np.nan
df.loc[~df["temperature"].between(-90, 65), "temperature"] = np.nan
df.loc[~df["humidity"].between(0, 100), "humidity"] = np.nan
df.loc[~df["wind_speed"].between(0, 100), "wind_speed"] = np.nan

print("\nMissing measurements after validation:")
print(df[measurement_columns].isna().sum())

# Remove records that do not contain all required measurements.
before = len(df)
df = df.dropna(subset=measurement_columns)
print(f"\nRemoved {before - len(df)} invalid measurement records.")

if df.empty:
    raise ValueError(
        "No valid weather or solar records remain. "
        "Check the original NASA POWER dataset and its download parameters."
    )

# Sort records city-wise and chronologically.
df = df.sort_values(["City", "date"]).reset_index(drop=True)

# Calendar features.
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["dayofyear"] = df["date"].dt.dayofyear

def get_season(month):
    if month in [12, 1, 2]:
        return 0
    elif month in [3, 4, 5]:
        return 1
    elif month in [6, 7, 8, 9]:
        return 2
    return 3

df["season"] = df["month"].apply(get_season)

# Previous day's radiation for each city.
df["previous_radiation"] = (
    df.groupby("City")["radiation"].shift(1)
)

# Remove first record of each city because it has no previous radiation.
df = df.dropna(subset=["previous_radiation"])

columns = [
    "City",
    "date",
    "month",
    "day",
    "dayofyear",
    "season",
    "temperature",
    "humidity",
    "wind_speed",
    "previous_radiation",
    "radiation"
]

df = df[columns].reset_index(drop=True)

if df.empty:
    raise ValueError(
        "No records remain after sequence preparation. "
        "Check whether each city has enough valid consecutive records."
    )

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
df.to_csv(OUTPUT, index=False)

print("\n========== PREPROCESSING COMPLETE ==========")
print("Processed shape:", df.shape)
print("\nFirst records:")
print(df.head().to_string(index=False))
print("\nFinal missing values:")
print(df.isna().sum())
print("\nSaved successfully:", OUTPUT)
print("============================================")