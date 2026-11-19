
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import WeatherCard from "../components/cards/WeatherCard";
import KPICard from "../components/cards/KPICard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import {
  Thermometer,
  Droplets,
  Wind,
  CloudSun,
  Sprout,
  Globe,
  Trees,
  Fuel,
  Mountain,
} from "lucide-react";

import { getWeather } from "../services/weatherService";
import { getCarbonImpact } from "../services/carbonService";
import { useDate } from "../context/DateContext";
import { getQueryDatesForPage } from "../utils/dateAdapter";

// API Error Handler
const getApiError = (err, fallback) => {
  const detail =
    err?.response?.data?.error?.detail ||
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message;

  return typeof detail === "string" ? detail : fallback;
};

// Metric Formatter
const formatMetric = (value, digits = 2) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number(value) === -999 ||
    !Number.isFinite(Number(value))
  ) {
    return "N/A";
  }

  return Number(value).toFixed(digits);
};

const WeatherPage = () => {
  const { selectedDate, periodMode } = useDate();

  const [weather, setWeather] = useState(null);
  const [carbon, setCarbon] = useState(null);

  const [weatherLoading, setWeatherLoading] = useState(true);
  const [carbonLoading, setCarbonLoading] = useState(true);

  const [weatherError, setWeatherError] = useState("");
  const [carbonError, setCarbonError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      const dates = getQueryDatesForPage(
        "weather",
        selectedDate,
        periodMode
      );

      setWeather(null);
      setCarbon(null);

      setWeatherError("");
      setCarbonError("");

      setWeatherLoading(true);
      setCarbonLoading(true);

      // Load Weather Data
      const loadWeather = async () => {
        try {
          const data = await getWeather(dates);

          if (isActive) {
            setWeather(data);
          }
        } catch (err) {
          console.error("Weather loading error:", err);

          if (isActive) {
            setWeatherError(
              getApiError(err, "Failed to load weather data.")
            );
          }
        } finally {
          if (isActive) {
            setWeatherLoading(false);
          }
        }
      };

      // Load Carbon Impact Data
      const loadCarbon = async () => {
        try {
          const data = await getCarbonImpact(dates);

          if (isActive) {
            setCarbon(data);
          }
        } catch (err) {
          console.error("Carbon impact loading error:", err);

          if (isActive) {
            setCarbonError(
              getApiError(err, "Failed to load carbon impact data.")
            );
          }
        } finally {
          if (isActive) {
            setCarbonLoading(false);
          }
        }
      };

      await Promise.all([
        loadWeather(),
        loadCarbon(),
      ]);
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [selectedDate, periodMode]);

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* PAGE HEADER */}
        <h1 className="text-4xl font-bold mb-8">
          Weather & Environmental Impact
        </h1>

        {/* ================= WEATHER SECTION ================= */}

        <h2 className="text-2xl font-semibold mb-5">
          Weather Conditions
        </h2>

        {weatherLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader />
          </div>
        ) : weatherError ? (
          <div className="mb-8">
            <ErrorMessage message={weatherError} />
          </div>
        ) : (
          <>
            {/* WEATHER KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

              <KPICard
                title="Temperature"
                value={formatMetric(weather?.temperature)}
                unit={weather?.temperature == null ? "" : "°C"}
                icon={Thermometer}
                color="from-orange-500 to-red-500"
              />

              <KPICard
                title="Humidity"
                value={formatMetric(weather?.humidity)}
                unit={weather?.humidity == null ? "" : "%"}
                icon={Droplets}
                color="from-blue-500 to-cyan-500"
              />

              <KPICard
                title="Wind Speed"
                value={formatMetric(weather?.wind_speed)}
                unit={weather?.wind_speed == null ? "" : "m/s"}
                icon={Wind}
                color="from-teal-500 to-emerald-500"
              />

              <KPICard
                title="Condition"
                value={weather?.condition || "Unavailable"}
                unit=""
                icon={CloudSun}
                color="from-amber-500 to-yellow-500"
              />

            </div>

            {/* WEATHER DETAILS */}
            <WeatherCard
              weather={weather || {}}
              selectedDate={selectedDate}
              range="daily"
            />
          </>
        )}

        {/* ================= ENVIRONMENTAL IMPACT ================= */}

        <h2 className="text-2xl font-semibold mt-10 mb-5">
          Environmental Impact
        </h2>

        {/* DATA SOURCE INFORMATION */}
        {carbon && !carbonLoading && !carbonError && (
          <p className="text-sm text-gray-500 mb-5">
            {carbon.status === "actual"
              ? "Actual historical performance"
              : "Predicted solar performance"}

            {" · Source: "}

            {carbon.source || "N/A"}
          </p>
        )}

        {carbonLoading ? (
          <div className="flex min-h-[180px] items-center justify-center">
            <Loader />
          </div>
        ) : carbonError ? (
          <ErrorMessage message={carbonError} />
        ) : (
          <>
            {/* ENVIRONMENTAL KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <KPICard
                title="Daily CO₂ Saved"
                value={formatMetric(carbon?.daily_co2_saved)}
                unit={carbon?.daily_co2_saved == null ? "" : "kg"}
                icon={Sprout}
                color="from-green-500 to-emerald-600"
              />

              <KPICard
                title="Yearly CO₂ Saved"
                value={formatMetric(carbon?.yearly_co2_saved)}
                unit={carbon?.yearly_co2_saved == null ? "" : "kg"}
                icon={Globe}
                color="from-cyan-500 to-blue-600"
              />

              <KPICard
                title="Trees Equivalent"
                value={formatMetric(carbon?.trees_equivalent)}
                unit={carbon?.trees_equivalent == null ? "" : "trees"}
                icon={Trees}
                color="from-green-600 to-lime-500"
              />

              <KPICard
                title="Coal Saved"
                value={formatMetric(carbon?.coal_saved)}
                unit={carbon?.coal_saved == null ? "" : "kg"}
                icon={Mountain}
                color="from-slate-500 to-gray-700"
              />

            </div>

            {/* PETROL SAVINGS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <KPICard
                title="Petrol Saved"
                value={formatMetric(carbon?.petrol_saved)}
                unit={carbon?.petrol_saved == null ? "" : "litres"}
                icon={Fuel}
                color="from-orange-500 to-amber-600"
              />

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default WeatherPage;
