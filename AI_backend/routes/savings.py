from fastapi import APIRouter, Depends
from services.nasa_service import get_nasa_weather
from services.preprocessing import nasa_json_to_dataframe
from services.savings_service import calculate_savings
from schemas.response_schema import SavingsResponse
from dependencies.auth import verify_ai_api_key
router = APIRouter()
@router.get("", dependencies=[Depends(verify_ai_api_key)], response_model=SavingsResponse)
def savings(latitude: float, longitude: float, start: str, end: str, solar_capacity: float = 5.0, electricity_rate: float = 8.0):
    weather = get_nasa_weather(latitude, longitude, start, end)
    df = nasa_json_to_dataframe(weather)
    return calculate_savings(df, solar_capacity, electricity_rate)