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

        setLoading(true);
        setError("");

        const data = await getDashboard(
          17.385,
          78.487,
          "20240101",
          "20240107"
        );

        console.log("DASHBOARD RESPONSE:", data);

        setDashboard(data);

      } catch (err) {

        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center min-h-[60vh]">

          <Loader />

        </div>

      </DashboardLayout>

    );

  }


  // ==========================================
  // ERROR
  // ==========================================

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


  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!dashboard) {

    return (

      <DashboardLayout>

        <p className="text-gray-500">

          No dashboard data available.

        </p>

      </DashboardLayout>

    );

  }


  // ==========================================
  // EXTRACT DATA
  // ==========================================

  const dashboardData = dashboard.dashboard || {};

  const prediction =
    dashboardData.prediction || {};

  const analytics =
    dashboardData.analytics || {};

  const weather =
    dashboardData.weather || {};

  // Supports both possible response structures
  const appliances =
    dashboardData.appliances ||
    dashboard.appliances ||
    {};

  const recommendedAppliances =
    appliances.recommended || [];


  // ==========================================
  // UI
  // ==========================================

  return (

    <DashboardLayout>

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">

          Welcome to ArkaAI ☀️

        </h1>

        <p className="text-gray-500 mt-2">

          Monitor your solar performance and energy insights.

        </p>

      </div>


      {/* ======================================
          KPI CARDS
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <KPICard
          title="Solar Radiation"
          value={
            prediction.predicted_radiation !== undefined
              ? `${prediction.predicted_radiation} kWh/m²`
              : "N/A"
          }
        />


        <KPICard
          title="Daily Energy"
          value={
            analytics.daily_energy !== undefined
              ? `${analytics.daily_energy} kWh`
              : "N/A"
          }
        />


        <KPICard
          title="Daily Savings"
          value={
            analytics.daily_saving !== undefined
              ? `₹${analytics.daily_saving}`
              : "N/A"
          }
        />


        <KPICard
          title="Weather"
          value={
            weather.condition || "N/A"
          }
        />

      </div>


      {/* ======================================
          FORECAST
      ====================================== */}

      <div className="mb-6">

        <ForecastChart
          prediction={prediction}
        />

      </div>


      {/* ======================================
          WEATHER + SAVINGS
      ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <WeatherCard

          temperature={
            weather.temperature ?? "N/A"
          }

          humidity={
            weather.humidity ?? "N/A"
          }

          wind={
            weather.wind_speed ?? "N/A"
          }

          condition={
            weather.condition ?? "N/A"
          }

        />


        <SavingsCard

          amount={
            analytics.yearly_saving ?? 0
          }

        />

      </div>


      {/* ======================================
          RECOMMENDATIONS
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">

              Recommended Appliances

            </h2>

            <p className="text-sm text-gray-500 mt-1">

              Best appliances to use during peak solar generation.

            </p>

          </div>

        </div>


        {

          recommendedAppliances.length > 0 ? (

            <div className="space-y-3">

              {

                recommendedAppliances.map(
                  (item, index) => (

                    <RecommendationCard

                      key={`${item}-${index}`}

                      appliance={item}

                      time={
                        appliances.best_time ||
                        "Best solar hours"
                      }

                    />

                  )
                )

              }

            </div>

          ) : (

            <div className="py-8 text-center">

              <p className="text-gray-500">

                No appliance recommendations available yet.

              </p>

              <p className="text-sm text-gray-400 mt-2">

                Configure your appliances in Settings
                to receive personalized recommendations.

              </p>

            </div>

          )

        }

      </div>


    </DashboardLayout>

  );

};


export default DashboardPage;