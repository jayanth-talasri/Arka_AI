from fastapi import APIRouter

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"]
)


@router.post("/")
def predict():

    return {
        "prediction": 6.85,
        "unit": "kWh",
        "confidence": 0.94
    }