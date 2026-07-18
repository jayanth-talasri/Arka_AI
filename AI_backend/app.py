from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.forecast import router as forecast_router

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


@app.get("/")
def root():
    return {
        "message": "ArkaAI AI Backend Running 🚀"
    }