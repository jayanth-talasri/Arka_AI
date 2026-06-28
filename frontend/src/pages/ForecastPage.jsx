import { useEffect, useState } from "react";
import { getForecast } from "../services/forecastService";

import DashboardLayout from "../layouts/DashboardLayout";

import ForecastSummaryCard from "../components/cards/ForecastSummaryCard";
import AccuracyCard from "../components/cards/AccuracyCard";
import WeatherImpactCard from "../components/cards/WeatherImpactCard";

import ForecastChart from "../charts/ForecastChart";
import DailyForecastChart from "../charts/DailyForecastChart";
import WeeklyForecastChart from "../charts/WeeklyForecastChart";

const ForecastPage = () => {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const data = await getForecast();
        setForecast(data);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

const [loading, setLoading] = useState(true);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Solar Forecasting
        </h1>

        <ForecastSummaryCard
          generation={`${forecast.summary.generation} kWh`}
          peakTime={forecast.summary.peakTime}
          savings={forecast.summary.savings}
        />

        <div className="mt-6">
          <ForecastChart data={forecast.hourlyforecast} />
        </div>

        <div className="mt-6">
          <DailyForecastChart data={forecast.dailyforecast} />
        </div>

        <div className="mt-6">
          <WeeklyForecastChart data={forecast.weeklyforecast} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <AccuracyCard />

          <WeatherImpactCard />

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ForecastPage;