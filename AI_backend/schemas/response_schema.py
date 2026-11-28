from typing import Optional

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
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    condition: str
    source : Optional[str] = None
    date : Optional[str] = None
    status : Optional[str] = None

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

    date : Optional[str] = None
    predicted_radiation : Optional[float] = None
    radiation_unit : Optional[str] = None
    solar_window : Optional[dict] = None

    not_recommended : Optional[list[str]] = None
    appliance_schedules : Optional[list[dict]] = None
    recommendation_notes : Optional[list[str]] = None

    estimated_energy : Optional[float] = None
    estimated_savings : Optional[float] = None
    solar_data_source : Optional[str] = None

class RecommdationResponse(BaseModel):
    status: str
    message : Optional[str] = None
    predicted_radiation: Optional[float] = None
    energy: Optional[float] = None
    saving: Optional[float] = None


class DashboardResponse(BaseModel):
    location: dict
    prediction: dict
    weather: dict
    recommendation: dict
    analytics: dict
    savings: dict
    appliances: dict

class CarbonResponse(BaseModel):
    carbon_impact: float
    unit: str

class SolarScoreResponse(BaseModel):
    solar_score: float
    grade: str
    status: str

