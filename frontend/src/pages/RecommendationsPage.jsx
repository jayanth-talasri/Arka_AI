import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getRecommendations } from "../services/recommendationService";
import { getAppliances } from "../services/applianceService";
import { getAnalytics } from "../services/analyticsService";
import { getWeather } from "../services/weatherService";

const RecommendationsPage = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [appliances, setAppliances] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const latitude = 17.385;
      const longitude = 78.487;
      const start = "20240101";
      const end = "20240107";

      try {
        const [rec, app, ana, wea] = await Promise.all([
          getRecommendations(latitude, longitude, start, end),
          getAppliances(latitude, longitude, start, end),
          getAnalytics(latitude, longitude, start, end),
          getWeather(latitude, longitude, start, end),
        ]);

        setRecommendation(rec);
        setAppliances(app);
        setAnalytics(ana);
        setWeather(wea);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  if (
    !recommendation ||
    !appliances ||
    !analytics ||
    !weather
  ) {
    return (
      <DashboardLayout>
        <h2 className="text-2xl font-bold">
          Loading Recommendations...
        </h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">

        <h1 className="text-3xl font-bold">
          AI Recommendations
        </h1>

        {/* Status */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Solar Status
          </h2>

          <h3 className="text-5xl font-bold text-yellow-500">
            {recommendation.status}
          </h3>

          <p className="mt-5 text-gray-600">
            {recommendation.message}
          </p>
        </div>

        {/* Best Time */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Best Time to Use Appliances
          </h2>

          <p className="text-3xl font-bold text-blue-600">
            {appliances.best_time}
          </p>
        </div>

        {/* Recommended Appliances */}

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recommended Appliances
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {appliances.recommended.map((item, index) => (

              <div
                key={index}
                className="border rounded-lg p-5 hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg font-semibold">
                  {item}
                </h3>
              </div>

            ))}

          </div>
        </div>

        {/* Analytics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Daily Energy
            </p>

            <h2 className="text-3xl font-bold">
              {analytics.daily_energy} kWh
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Daily Saving
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ₹{analytics.daily_saving}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              CO₂ Saved
            </p>

            <h2 className="text-3xl font-bold text-emerald-600">
              {analytics.co2_saved} kg
            </h2>
          </div>

        </div>

        {/* Weather */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Current Weather
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div>
              <p className="text-gray-500">
                Temperature
              </p>

              <h2 className="text-2xl font-bold">
                {weather.temperature} °C
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Humidity
              </p>

              <h2 className="text-2xl font-bold">
                {weather.humidity} %
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Wind Speed
              </p>

              <h2 className="text-2xl font-bold">
                {weather.wind_speed} m/s
              </h2>
            </div>

            <div>
              <p className="text-gray-500">
                Condition
              </p>

              <h2 className="text-2xl font-bold">
                {weather.condition}
              </h2>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;