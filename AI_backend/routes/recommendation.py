from fastapi import APIRouter

from services.recommendation import generate_recommendation

router = APIRouter()

@router.get("/recommendation")
def recommendation(prediction: float):

    return generate_recommendation(prediction)