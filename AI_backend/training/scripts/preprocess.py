import pandas as pd
import os

INPUT = "training/data/merged/solar_dataset.csv"
OUTPUT = "training/data/processed/processed_dataset.csv"

print("Loading Dataset...")

df = pd.read_csv(INPUT)

df["date"] = pd.to_datetime(
    df[["YEAR", "MO", "DY"]].rename(
        columns={
            "YEAR": "year",
            "MO": "month",
            "DY": "day"
        }
    )
)

df = df.sort_values(["City", "date"])

df = df.rename(columns={
    "ALLSKY_SFC_SW_DWN": "radiation",
    "T2M": "temperature",
    "RH2M": "humidity",
    "WS10M": "wind_speed"
})

df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["dayofyear"] = df["date"].dt.dayofyear
def get_season(month):

    if month in [12, 1, 2]:
        return 0      # Winter

    elif month in [3, 4, 5]:
        return 1      # Summer

    elif month in [6, 7, 8, 9]:
        return 2      # Monsoon

    else:
        return 3      # Post Monsoon


df["season"] = df["month"].apply(get_season)

df["previous_radiation"] = (
    df.groupby("City")["radiation"]
      .shift(1)
)

df = df.dropna()

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

df = df[columns]

os.makedirs("training/data/processed", exist_ok=True)

df.to_csv(OUTPUT, index=False)

print(df.head())

print()

print("Processed Shape:", df.shape)

print()

print("Saved Successfully")