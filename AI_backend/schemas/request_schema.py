from pydantic import BaseModel

class PredictionRequest(BaseModel):

    latitude: float
    longitude: float

    start: str
    end: str

class WeatherRequest(BaseModel):

    latitude: float
    longitude: float

    start: str
    end: str

class DashboardRequest(BaseModel):

    latitude: float
    longitude: float

    start: str
    end: str