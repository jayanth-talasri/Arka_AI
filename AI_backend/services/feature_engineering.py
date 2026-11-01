import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

FEATURE_COLUMNS = [
    "radiation",
    "temperature",
    "humidity",
    "wind_speed"
]

def prepare_features(df):
    """
    Validate and scale solar and weather features.
    """
    missing_columns = [col for col in FEATURE_COLUMNS if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    features_df = df[FEATURE_COLUMNS].copy()
    features_df = features_df.apply(pd.to_numeric, errors="coerce")
    features_df = features_df.replace([-999, -999.0, np.inf, -np.inf], np.nan)
    invalid_rows = features_df.isna().any(axis=1)
    if invalid_rows.any():
        raise ValueError(
            f"Dataset contains {invalid_rows.sum()} rows with missing or invalid features. "
            "Clean the dataset before training."
        )
    if len(features_df) < 1:
        raise ValueError("No valid feature records available.")
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(features_df)
    return scaled_features, scaler

def create_sequences(data, sequence_length=7):
    """
    Create sequences for LSTM input.
    """
    if sequence_length < 1:
        raise ValueError("sequence_length must be at least 1.")
    if len(data) < sequence_length:
        raise ValueError(
            f"Not enough records. Need {sequence_length}, received {len(data)}."
        )
    sequences = []
    for i in range(len(data) - sequence_length + 1):
        sequences.append(data[i:i + sequence_length])
    return np.array(sequences)