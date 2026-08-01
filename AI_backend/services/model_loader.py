import joblib
from tensorflow.keras.models import load_model

MODEL_PATH = "training/model/solar_lstm.keras"
SCALER_X_PATH = "training/model/scaler_x.pkl"
SCALER_Y_PATH = "training/model/scaler_y.pkl"

model = load_model(MODEL_PATH)

scaler_x = joblib.load(SCALER_X_PATH)

scaler_y = joblib.load(SCALER_Y_PATH)