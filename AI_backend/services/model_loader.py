import joblib
from tensorflow.keras.models import load_model

MODEL = load_model("training/model/Solar_lstm.keras")

SCALER_X = joblib.load("training/model/scaler_x.pkl")
SCALER_Y = joblib.load("training/model/scaler_y.pkl")

print("\n==============================")
print("SCALER FEATURES")

if hasattr(SCALER_X, "feature_names_in_"):
    print(SCALER_X.feature_names_in_)
else:
    print("No feature names stored")

print("==============================\n")