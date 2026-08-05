from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.nasa import router as nasa_router
from routes.predict import router as predict_router

from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.feature_engineering import (
    prepare_features,
    create_sequences,
)

from routes.forecast import router as forecast_router
from routes.analytics import router as analytics_router
from routes.weather import router as weather_router
from routes.savings import router as savings_router
from routes.appliance import router as appliance_router
from routes.dashboard import router as dashboard_router
from routes.history import router as history_router
from routes.solar_score import router as score_router
from routes.insights import router as insights_router
from routes.carbon_impact import router as carbon_router
from routes.report import router as report_router
from routes.recommendation import router as recommendation_router

from config import TITLE, VERSION, DESCRIPTION

app = FastAPI(
    title=TITLE,
    version=VERSION,
    description=DESCRIPTION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    nasa_router,
    prefix="/nasa",
    tags=["NASA"]
)
app.include_router(
    forecast_router,
    prefix="/forecast",
    tags=["Forecast"]
)
app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    weather_router,
    prefix="/weather",
    tags=["Weather"]
)

app.include_router(
    predict_router,
    prefix="/predict",
    tags=["Prediction"]
)
app.include_router(
    savings_router,
    prefix="/savings",
    tags=["Savings"]
)
app.include_router(
    appliance_router,
    prefix="/appliances",
    tags=["Appliances"]
)
app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)
app.include_router(
    history_router,
    prefix="/history",
    tags=["History"]
)
app.include_router(
    score_router,
    prefix="/solar-score",
    tags=["Solar Score"]
)
app.include_router(
    insights_router,
    prefix="/insights",
    tags=["Insights"]
)
app.include_router(
    carbon_router,
    prefix="/carbon-impact",
    tags=["Carbon Impact"]
)
app.include_router(
    report_router,
    prefix="/report",
    tags=["Reports"]
)
app.include_router(
    recommendation_router,
    prefix="/recommendation",
    tags=["Recommendation"]
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