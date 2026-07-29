import numpy as np
from sklearn.preprocessing import MinMaxScaler

def prepare_features(df):
    """
    Prepare weather features for LSTM.
    """

    features = df[
        [
            "radiation",
            "temperature",
            "humidity",
            "wind_speed"
        ]
    ].values

    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(features)
    return scaled_features, scaler
def create_sequences(data, sequence_length=7):
    """
    Create sequences for LSTM input.
    """
    sequences = []

    for i in range(len(data) - sequence_length + 1):
        sequences.append(data[i:i + sequence_length])

    return np.array(sequences)