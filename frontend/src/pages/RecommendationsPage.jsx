import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getRecommendations } from "../services/recommendationService";
import { getAppliances } from "../services/applianceService";
import { getAnalytics } from "../services/analyticsService";
import { getWeather } from "../services/weatherService";

const START_DATE = "20240101";
const END_DATE = "20240107";

const RecommendationsPage = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [appliances, setAppliances] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          recResponse,
          applianceResponse,
          analyticsResponse,
          weatherResponse,
        ] = await Promise.all([
          getRecommendations(START_DATE, END_DATE),
          getAppliances(START_DATE, END_DATE),
          getAnalytics(START_DATE, END_DATE),
          getWeather(),
        ]);

        setRecommendation(
          recResponse?.recommendation ||
            recResponse?.recommendations ||
            recResponse
        );

        setAppliances(
          applianceResponse?.appliances ||
            applianceResponse
        );

        setAnalytics(
          analyticsResponse?.analytics ||
            analyticsResponse
        );

        setWeather(
          weatherResponse?.weather ||
            weatherResponse
        );

      } catch (err) {
        console.error("Recommendation loading error:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.detail ||
            "Failed to load recommendations."
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
        <div className="min-h-[60vh] flex items-center justify-center">
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

  const recommended =
    appliances?.recommended ||
    appliances?.recommendations ||
    [];

  return (
    <DashboardLayout>

      <div className="p-6 md:p-8 space-y-8">

        <div>
          <p className="text-sm font-semibold text-amber-500">
            ARKAAI INTELLIGENCE
          </p>

          <h1 className="text-3xl font-bold">
            AI Recommendations
          </h1>

          <p className="text-gray-500 mt-2">
            Optimize your energy consumption using AI-powered insights.
          </p>
        </div>

        {/* SOLAR STATUS */}

        <div className="
          bg-white rounded-2xl shadow-sm
          border border-gray-100 p-6
        ">

          <h2 className="text-xl font-semibold mb-4">
            Solar Status
          </h2>

          <h3 className="
            text-4xl md:text-5xl
            font-bold text-amber-500
          ">
            {recommendation?.status ?? "Unknown"}
          </h3>

          <p className="mt-5 text-gray-600">
            {recommendation?.message ??
              recommendation?.recommendation ??
              "AI recommendation is currently unavailable."}
          </p>

        </div>

        {/* BEST TIME */}

        <div className="
          bg-white rounded-2xl shadow-sm
          border border-gray-100 p-6
        ">

          <h2 className="text-xl font-semibold mb-4">
            Best Time to Use Appliances
          </h2>

          <p className="
            text-3xl font-bold text-blue-600
          ">
            {appliances?.best_time ??
              "No recommendation available"}
          </p>

        </div>

        {/* APPLIANCES */}

        <div className="
          bg-white rounded-2xl shadow-sm
          border border-gray-100 p-6
        ">

          <h2 className="text-xl font-semibold mb-5">
            Recommended Appliances
          </h2>

          {recommended.length > 0 ? (
            <div className="
              grid grid-cols-1 md:grid-cols-3 gap-5
            ">

              {recommended.map((item, index) => (
                <div
                  key={index}
                  className="
                    border rounded-xl p-5
                    hover:shadow-lg transition
                  "
                >
                  <h3 className="text-lg font-semibold">
                    {typeof item === "string"
                      ? item
                      : item.name || JSON.stringify(item)}
                  </h3>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500">
              No appliance recommendations available.
            </p>
          )}

        </div>

        {/* ANALYTICS */}

        <div className="
          grid grid-cols-1 md:grid-cols-3 gap-5
        ">

          <div className="
            bg-white rounded-xl shadow-sm
            border border-gray-100 p-6
          ">
            <p className="text-gray-500">
              Daily Energy
            </p>

            <h2 className="text-3xl font-bold">
              {Number(
                analytics?.daily_energy ?? 0
              ).toFixed(2)} kWh
            </h2>
          </div>

          <div className="
            bg-white rounded-xl shadow-sm
            border border-gray-100 p-6
          ">
            <p className="text-gray-500">
              Daily Saving
            </p>

            <h2 className="
              text-3xl font-bold text-green-600
            ">
              ₹{Number(
                analytics?.daily_saving ?? 0
              ).toFixed(2)}
            </h2>
          </div>

          <div className="
            bg-white rounded-xl shadow-sm
            border border-gray-100 p-6
          ">
            <p className="text-gray-500">
              CO₂ Saved
            </p>

            <h2 className="
              text-3xl font-bold text-emerald-600
            ">
              {Number(
                analytics?.co2_saved ?? 0
              ).toFixed(2)} kg
            </h2>
          </div>

        </div>

        {/* WEATHER */}

        <div className="
          bg-white rounded-2xl shadow-sm
          border border-gray-100 p-6
        ">

          <h2 className="text-xl font-semibold mb-5">
            Current Weather
          </h2>

          <div className="
            grid grid-cols-2 md:grid-cols-4 gap-6
          ">

            <div>
              <p className="text-gray-500">
                Temperature
              </p>

              <h2 className="text-2xl font-bold">
                {weather?.temperature ?? 0} °C
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Humidity
              </p>

              <h2 className="text-2xl font-bold">
                {weather?.humidity ?? 0} %
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Wind Speed
              </p>

              <h2 className="text-2xl font-bold">
                {weather?.wind_speed ?? 0} m/s
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Condition
              </p>

              <h2 className="text-2xl font-bold">
                {weather?.condition ?? "Unknown"}
              </h2>
            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default RecommendationsPage;