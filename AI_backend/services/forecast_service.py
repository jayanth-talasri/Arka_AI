import numpy as np

from services.model_loader import model
from services.model_loader import scaler_x
from services.model_loader import scaler_y

def recursive_forecast(features, days=7):

    """
    Predict multiple future days recursively.
    """

    predictions = []

    current_window = np.array(features)

    current_window = current_window.reshape(1, current_window.shape[0], current_window.shape[1])

    for _ in range(days):

        prediction = model.predict(current_window, verbose=0)

        radiation = scaler_y.inverse_transform(prediction)[0][0]

        predictions.append(round(float(radiation), 2))

        next_features = current_window[0][-1].copy()

        next_features[0] = prediction[0][0]

        current_window = np.concatenate(

            [
                current_window[:, 1:, :],
                next_features.reshape(1, 1, -1)
            ],

            axis=1

        )

    return predictions