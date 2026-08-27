from dotenv import load_dotenv
import os

load_dotenv()

print("================================")
print("AI BACKEND CONFIG")
print("AI_API_KEY EXISTS:", bool(os.getenv("AI_API_KEY")))
print("AI_API_KEY LENGTH:", len(os.getenv("AI_API_KEY", "")))
print("================================")

HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))

TITLE = os.getenv("TITLE")
VERSION = os.getenv("VERSION")
DESCRIPTION = os.getenv("DESCRIPTION")

NASA_API = os.getenv("NASA_API")

MODEL_PATH = os.getenv("MODEL_PATH")
SCALER_X_PATH = os.getenv("SCALER_X_PATH")
SCALER_Y_PATH = os.getenv("SCALER_Y_PATH")

PANEL_CAPACITY = float(os.getenv("PANEL_CAPACITY"))
PANEL_EFFICIENCY = float(os.getenv("PANEL_EFFICIENCY"))
UNIT_PRICE = float(os.getenv("UNIT_PRICE"))