
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

const formatNumber = (value, decimals = 2) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(decimals) : "0.00";
};

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

        const [
          recResult,
          applianceResult,
          analyticsResult,
          weatherResult
        ] = results;

        const newErrors = {};

        if (recResult.status === "fulfilled") {
          const data = recResult.value;

          setRecommendation(
            data?.recommendation ||
            data?.recommendations ||
            data
          );
        } else {
          newErrors.recommendation = getError(recResult.reason);
        }

        if (applianceResult.status === "fulfilled") {
          const data = applianceResult.value;

          setAppliances(
            data?.appliances ||
            data?.recommendations ||
            data
          );
        } else {
          newErrors.appliances = getError(applianceResult.reason);
        }

        if (analyticsResult.status === "fulfilled") {
          const data = analyticsResult.value;

          setAnalytics(
            data?.analytics ||
            data
          );
        } else {
          newErrors.analytics = getError(analyticsResult.reason);
        }

        if (weatherResult.status === "fulfilled") {
          const data = weatherResult.value;

          setWeather(
            data?.weather ||
            data
          );
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

  // Existing recommended appliance list.
  const recommended =
    appliances?.recommended ||
    appliances?.recommendations ||
    [];

  // NEW: Individual appliance schedules from FastAPI.
  const applianceSchedules =
    appliances?.appliance_schedules ||
    appliances?.schedules ||
    [];

  const notRecommended =
    appliances?.not_recommended || [];

  const recommendationNotes =
    appliances?.recommendation_notes || [];

  const solarWindow = appliances?.solar_window || {};

  const unavailable = (message) => (
    <p className="text-sm text-red-500 mt-3">
      {message || "Data temporarily unavailable."}
    </p>
  );

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 space-y-8">

        {/* PAGE HEADER */}
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

          <p className="text-sm text-gray-500 mt-2">
            Selected Date: {selectedDate}
          </p>
        </div>

        {/* GENERAL ERROR */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
            {errors.general}
          </div>
        )}

        {/* SOLAR STATUS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Solar Status
          </h2>

          {errors.recommendation ? (
            unavailable(errors.recommendation)
          ) : (
            <>
              <h3 className="text-4xl md:text-5xl font-bold text-amber-500">
                {recommendation?.status ??
                  appliances?.status ??
                  "Unknown"}
              </h3>

              <p className="mt-5 text-gray-600">
                {recommendation?.message ??
                  recommendation?.recommendation ??
                  "Solar recommendations are based on the selected date."}
              </p>

              {appliances?.predicted_radiation != null && (
                <p className="text-sm text-gray-500 mt-3">
                  Solar Radiation:{" "}
                  {formatNumber(appliances.predicted_radiation, 3)}{" "}
                  {appliances.radiation_unit || "kWh/m²/day"}
                </p>
              )}
            </>
          )}
        </div>

        {/* INDIVIDUAL APPLIANCE SCHEDULES */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold">
                Individual Appliance Schedules
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Recommended operating times based on hourly solar availability.
              </p>
            </div>

            {appliances?.solar_data_source && (
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                {appliances.solar_data_source}
              </span>
            )}
          </div>

          {errors.appliances ? (
            unavailable(errors.appliances)
          ) : applianceSchedules.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {applianceSchedules.map((schedule, index) => (
                <div
                  key={`${schedule.appliance || schedule.name}-${index}`}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                >

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {schedule.appliance ||
                        schedule.name ||
                        "Appliance"}
                    </h3>

                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                      {schedule.status || "Recommended"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-gray-500">
                      Recommended Operating Time
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {schedule.best_time ||
                        `${schedule.start_time || "--"} - ${schedule.end_time || "--"}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-gray-500">
                        Duration
                      </p>

                      <p className="font-semibold text-gray-800">
                        {schedule.duration_hours ?? "--"} hours
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Power
                      </p>

                      <p className="font-semibold text-gray-800">
                        {schedule.estimated_power_kw != null
                          ? `${formatNumber(schedule.estimated_power_kw)} kW`
                          : "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Estimated Energy
                      </p>

                      <p className="font-semibold text-gray-800">
                        {schedule.estimated_energy_kwh != null
                          ? `${formatNumber(schedule.estimated_energy_kwh)} kWh`
                          : "--"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Power Rating
                      </p>

                      <p className="font-semibold text-gray-800">
                        {schedule.rating_is_estimated
                          ? "Estimated"
                          : "Configured default"}
                      </p>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="font-semibold text-amber-800">
                No individual operating times available.
              </p>

              <p className="text-sm text-amber-700 mt-2">
                {recommendationNotes[0] ||
                  "Hourly solar data may be unavailable for the selected date, or no appliance could be scheduled."}
              </p>
            </div>
          )}

          {/* SOLAR DAYLIGHT INFORMATION */}
          {(solarWindow.sunrise || solarWindow.sunset) && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">
                Solar Daylight Information
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Sunrise
                  </p>

                  <p className="font-semibold text-gray-800">
                    {solarWindow.sunrise || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Solar Noon
                  </p>

                  <p className="font-semibold text-gray-800">
                    {solarWindow.solar_noon || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Sunset
                  </p>

                  <p className="font-semibold text-gray-800">
                    {solarWindow.sunset || "--"}
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* RECOMMENDED APPLIANCES */}
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

          {/* NOT RECOMMENDED APPLIANCES */}
          {notRecommended.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">

              <h3 className="font-semibold text-gray-800 mb-3">
                Not Recommended for Solar Operation
              </h3>

              <div className="flex flex-wrap gap-3">
                {notRecommended.map((item, index) => (
                  <span
                    key={index}
                    className="bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-lg text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>
          )}

          {/* RECOMMENDATION NOTES */}
          {recommendationNotes.length > 0 && (
            <div className="mt-5 space-y-2">
              {recommendationNotes.map((note, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-600"
                >
                  • {note}
                </p>
              ))}
            </div>
          )}

        </div>

        {/* DAILY ENERGY / SAVINGS / CO2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">
              Daily Energy
            </p>

            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold">
                {formatNumber(analytics?.daily_energy)} kWh
              </h2>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">
              Daily Saving
            </p>

            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold text-green-600">
                ₹{formatNumber(analytics?.daily_saving)}
              </h2>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">
              CO₂ Saved
            </p>

            {errors.analytics ? (
              unavailable(errors.analytics)
            ) : (
              <h2 className="text-3xl font-bold text-emerald-600">
                {formatNumber(analytics?.co2_saved)} kg
              </h2>
            )}
          </div>

        </div>

        {/* WEATHER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <h2 className="text-xl font-semibold mb-5">
            Weather
          </h2>

          {errors.weather ? (
            unavailable(errors.weather)
          ) : (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

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
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;
