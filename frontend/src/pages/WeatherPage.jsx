import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import WeatherCard from "../components/cards/WeatherCard";
import KPICard from "../components/cards/KPICard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getWeather } from "../services/weatherService";
import { getCarbonImpact } from "../services/carbonService";


const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [carbon, setCarbon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          weatherData,
          carbonData,
        ] = await Promise.all([
          getWeather(),
          getCarbonImpact(),
        ]);

        setWeather(weatherData);
        setCarbon(carbonData);

      } catch (err) {
        console.error(
          "Weather loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to load weather data."
        );

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  if (loading) {
    return (
      <DashboardLayout>

        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>

      </DashboardLayout>
    );
  }


  if (error) {
    return (
      <DashboardLayout>

        <div className="p-6">
          <ErrorMessage message={error} />
        </div>

      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>

      <div className="p-6">

        <h1 className="text-4xl font-bold mb-8">
          Weather & Environmental Impact
        </h1>


        {/* WEATHER KPIs */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <KPICard
            title="Temperature"
            value={Number(
              weather?.temperature || 0
            ).toFixed(2)}
            unit="°C"
          />


          <KPICard
            title="Humidity"
            value={Number(
              weather?.humidity || 0
            ).toFixed(2)}
            unit="%"
          />


          <KPICard
            title="Wind Speed"
            value={Number(
              weather?.wind_speed || 0
            ).toFixed(2)}
            unit="m/s"
          />


          <KPICard
            title="Condition"
            value={weather?.condition || "Unknown"}
            unit=""
          />

        </div>


        {weather && (
          <WeatherCard weather={weather} />
        )}


        {/* ENVIRONMENTAL IMPACT */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <KPICard
            title="Daily CO₂ Saved"
            value={Number(
              carbon?.daily_co2_saved || 0
            ).toFixed(2)}
            unit="kg"
          />


          <KPICard
            title="Yearly CO₂ Saved"
            value={Number(
              carbon?.yearly_co2_saved || 0
            ).toFixed(2)}
            unit="kg"
          />


          <KPICard
            title="Trees Equivalent"
            value={Number(
              carbon?.trees_equivalent || 0
            ).toFixed(2)}
            unit="trees"
          />


          <KPICard
            title="Coal Saved"
            value={Number(
              carbon?.coal_saved || 0
            ).toFixed(2)}
            unit="kg"
          />

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          <KPICard
            title="Petrol Saved"
            value={Number(
              carbon?.petrol_saved || 0
            ).toFixed(2)}
            unit="litres"
          />

        </div>

      </div>

    </DashboardLayout>
  );
};

export default WeatherPage;