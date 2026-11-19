
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import { useDate } from "../context/DateContext";
import { getRecommendations } from "../services/recommendationService";
import { getAppliances } from "../services/applianceService";
import { getAnalytics } from "../services/analyticsService";
import { getWeather } from "../services/weatherService";

const getError = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.detail ||
  error?.message ||
  "Data temporarily unavailable.";

const RecommendationsPage = () => {
  const { selectedDate } = useDate();
  const [recommendation, setRecommendation] = useState(null);
  const [appliances, setAppliances] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setLoading(true);
      setErrors({});
      setRecommendation(null);
      setAppliances(null);
      setAnalytics(null);
      setWeather(null);

      try {
        const apiDate = selectedDate.replaceAll("-", "");
        const params = { start: apiDate, end: apiDate };

        const results = await Promise.allSettled([
          getRecommendations(params),
          getAppliances(apiDate, apiDate),
          getAnalytics(params),
          getWeather(params)
        ]);

        if (!isActive) return;

        const [recResult, applianceResult, analyticsResult, weatherResult] = results;
        const newErrors = {};

        if (recResult.status === "fulfilled") {
          const data = recResult.value;
          setRecommendation(
            data?.recommendation || data?.recommendations || data
          );
        } else {
          newErrors.recommendation = getError(recResult.reason);
        }

        if (applianceResult.status === "fulfilled") {
          const data = applianceResult.value;
          setAppliances(data?.appliances || data);
        } else {
          newErrors.appliances = getError(applianceResult.reason);
        }

        if (analyticsResult.status === "fulfilled") {
          const data = analyticsResult.value;
          setAnalytics(data?.analytics || data);
        } else {
          newErrors.analytics = getError(analyticsResult.reason);
        }

        if (weatherResult.status === "fulfilled") {
          const data = weatherResult.value;
          setWeather(data?.weather || data);
        } else {
          newErrors.weather = getError(weatherResult.reason);
        }

        setErrors(newErrors);
        console.log("Recommendations API results:", results);
      } catch (error) {
        if (!isActive) return;
        console.error("Recommendations loading error:", error);
        setErrors({ general: getError(error) });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [selectedDate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const recommended =
    appliances?.recommended || appliances?.recommendations || [];

  const unavailable = (message) => (
    <p className="text-sm text-red-500 mt-3">
      {message || "Data temporarily unavailable."}
    </p>
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">
        <div>
          <p className="text-sm font-semibold text-amber-500">
            ARKAAI INTELLIGENCE
          </p>
          <h1 className="text-3xl font-bold">AI Recommendations</h1>
          <p className="text-gray-500 mt-2">
            Optimize your energy consumption using AI-powered insights.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Selected Date: {selectedDate}
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
            {errors.general}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">Solar Status</h2>
          {errors.recommendation ? (
            unavailable(errors.recommendation)
          ) : (
            <>
              <h3 className="text-4xl md:text-5xl font-bold text-amber-500">
                {recommendation?.status ?? "Unknown"}
              </h3>
              <p className="mt-5 text-gray-600">
                {recommendation?.message ??
                  recommendation?.recommendation ??
                  "AI recommendation is currently unavailable."}
              </p>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Best Time to Use Appliances
          </h2>
          {errors.appliances ? (
            unavailable(errors.appliances)
          ) : (
            <p className="text-3xl font-bold text-blue-600">
              {appliances?.best_time ?? "No recommendation available"}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-5">
            Recommended Appliances
          </h2>
          {errors.appliances ? (
            unavailable(errors.appliances)
          ) : Array.isArray(recommended) && recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommended.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5 hover:shadow-lg transition"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">Daily Energy</p>
            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold">
                {Number(analytics?.daily_energy ?? 0).toFixed(2)} kWh
              </h2>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">Daily Saving</p>
            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold text-green-600">
                ₹{Number(analytics?.daily_saving ?? 0).toFixed(2)}
              </h2>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">CO₂ Saved</p>
            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold text-emerald-600">
                {Number(analytics?.co2_saved ?? 0).toFixed(2)} kg
              </h2>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-5">Weather</h2>
          {errors.weather ? (
            unavailable(errors.weather)
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-500">Temperature</p>
                <h2 className="text-2xl font-bold">
                  {weather?.temperature ?? 0} °C
                </h2>
              </div>
              <div>
                <p className="text-gray-500">Humidity</p>
                <h2 className="text-2xl font-bold">
                  {weather?.humidity ?? 0} %
                </h2>
              </div>
              <div>
                <p className="text-gray-500">Wind Speed</p>
                <h2 className="text-2xl font-bold">
                  {weather?.wind_speed ?? 0} m/s
                </h2>
              </div>
              <div>
                <p className="text-gray-500">Condition</p>
                <h2 className="text-2xl font-bold">
                  {weather?.condition ?? "Unknown"}
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
