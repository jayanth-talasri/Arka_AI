from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analytics import router as health_router
from routes.forecast import router as forecast_router
from routes.nasa import router as nasa_router
from routes.predict import router as predict_router


from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.feature_engineering import (
    prepare_features,
    create_sequences,
)

from routes.analytics import router as analytics_router
from routes.weather import router as weather_router

app = FastAPI(
    title="ArkaAI AI Backend",
    version="1.0.0",
    description="AI Prediction Service for ArkaAI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(forecast_router)
app.include_router(
    nasa_router,
    prefix="/nasa",
    tags=["NASA"]
)
app.include_router(
    analytics_router,
    prefix="",
    tags=["Analytics"]

)
app.include_router(
    weather_router,
    tags=["Weather"]

)
app.include_router(
    predict_router,
    prefix="/predict",
    tags=["Prediction"]
)

@app.get("/test-features")
def test_features():

    data = get_nasa_weather(
        latitude=17.385,
        longitude=78.487,
        start="20240101",
        end="20240114"
    )

    df = nasa_json_to_dataframe(data)

    scaled, scaler = prepare_features(df)

    sequences = create_sequences(
        scaled,
        sequence_length=7
    )

    return {
        "rows": len(df),
        "scaled_shape": list(scaled.shape),
        "sequence_shape": list(sequences.shape)
    }