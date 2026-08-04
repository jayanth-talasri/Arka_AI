import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";

import KPICard from "../components/cards/KPICard";
import ForecastChart from "../charts/ForecastChart";
import WeatherCard from "../components/cards/WeatherCard";
import SavingsCard from "../components/cards/SavingsCard";
import RecommendationCard from "../components/cards/RecommendationCard";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getDashboard } from "../services/dashboardService";

const DashboardPage = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        const data = await getDashboard(
          17.385,
          78.487,
          "20240101",
          "20240107"
        );

        console.log(data);

        setDashboard(data);

        toast.success("Dashboard Loaded Successfully");

      } catch (err) {

        console.error(err);

        setError("Unable to load dashboard.");

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  if (loading) {

    return (

      <DashboardLayout>

        <h2 className="text-2xl font-bold">

          Loading Dashboard...

        </h2>

      </DashboardLayout>

    );

  }

  if (error) {

    return (

      <DashboardLayout>

        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">

        Welcome to ArkaAI ☀️

      </h1>

      {/* KPI Cards */}

      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <KPICard
          title="Solar Radiation"
          value={`${dashboard.prediction.predicted_radiation} kWh/m²`}
        />

        <KPICard
          title="Daily Energy"
          value={`${dashboard.analytics.daily_energy} kWh`}
        />

        <KPICard
          title="Daily Savings"
          value={`₹${dashboard.analytics.daily_saving}`}
        />

        <KPICard
          title="Weather"
          value={dashboard.weather.condition}
        />

      </div>

      {/* Forecast Chart */}

      <ForecastChart
        prediction={dashboard.prediction}
      />

      {/* Weather + Savings */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <WeatherCard

          temperature={dashboard.weather.temperature}
          humidity={dashboard.weather.humidity}
          wind={dashboard.weather.wind_speed}
          condition={dashboard.weather.condition}

        />

        <SavingsCard

          amount={dashboard.analytics.yearly_saving}

        />

      </div>

      {/* Recommendations */}

      <div className="bg-white rounded-xl shadow p-6 mt-6">

        <h2 className="text-2xl font-semibold mb-4">

          Recommended Appliances

        </h2>

        {

          dashboard.appliances.recommended.map((item, index) => (

            <RecommendationCard

              key={index}

              appliance={item}

              time={dashboard.appliances.best_time}

            />

          ))

        }

      </div>

    </DashboardLayout>

  );

};

export default DashboardPage;