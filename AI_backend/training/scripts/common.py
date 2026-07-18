import pandas as pd
import numpy as np
import joblib

from sklearn.preprocessing import MinMaxScaler


# -----------------------------------
# Load Dataset
# -----------------------------------

def load_dataset(path):
    """
    Load CSV dataset.
    """
    return pd.read_csv(path)


# -----------------------------------
# Remove Missing Values
# -----------------------------------

def clean_dataset(df):
    """
    Remove missing values.
    """
    return df.dropna().reset_index(drop=True)


# -----------------------------------
# Split Features and Target
# -----------------------------------

def split_features_target(df, feature_columns, target_column):
    """
    Split dataset into X and y.
    """

    X = df[feature_columns]

    y = df[target_column]

    return X, y


# -----------------------------------
# Scale Features
# -----------------------------------

def scale_dataset(X, y):

    feature_scaler = MinMaxScaler()

    target_scaler = MinMaxScaler()

    X_scaled = feature_scaler.fit_transform(X)

    y_scaled = target_scaler.fit_transform(
        y.values.reshape(-1, 1)
    )

    return (
        X_scaled,
        y_scaled,
        feature_scaler,
        target_scaler,
    )


# -----------------------------------
# Save Scalers
# -----------------------------------

def save_scalers(feature_scaler,
                 target_scaler,
                 season,
                 save_path):

    joblib.dump(
        feature_scaler,
        f"{save_path}/{season}_feature_scaler.pkl"
    )

    joblib.dump(
        target_scaler,
        f"{save_path}/{season}_target_scaler.pkl"
    )