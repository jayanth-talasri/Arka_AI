from pydantic import BaseModel

class AnalyticsResponse(BaseModel):
    daily_energy: float
    monthly_energy: float
    yearly_energy: float

    daily_saving: float
    monthly_saving: float
    yearly_saving: float

    co2_saved: float
    trees_equivalent: float
    panel_efficiency: float

class PredictResponse(BaseModel):
    latitude: float
    longitude: float

    predicted_radiation: float
    unit: str

    estimated_energy: float
    energy_unit: str

    estimated_savings: float
    currency: str

    status: str
    recommendation: str

class WeatherResponse(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    condition: str

class SavingsResponse(BaseModel):
    daily_energy: float
    monthly_energy: float
    yearly_energy: float

    daily_saving: float
    monthly_saving: float
    yearly_saving: float

    lifetime_saving: float

class AppliancesResponse(BaseModel):
    status: str
    best_time: str
    recommended: list[str]

class DashboardResponse(BaseModel):
    location: dict
    prediction: dict
    weather: dict
    recommendation: dict
    analytics: dict
    savings: dict
    appliances: dict