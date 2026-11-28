
import { useEffect, useMemo, useState } from "react";
import {
  Sun,
  TrendingUp,
  Zap,
  IndianRupee,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import ForecastChart from "../charts/ForecastChart";
import WeeklyForecastChart from "../charts/WeeklyForecastChart";
import SavingsChart from "../charts/SavingsChart";

import { getForecast } from "../services/forecastService";
import {
  getPeriodDates,
  getErrorMessage,
} from "../services/apiHelper";

import { useDate } from "../context/DateContext";

const formatValue = (value, digits = 2) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return "N/A";
  }

  return Number(value).toFixed(digits);
};

const ForecastPage = () => {
  // Use the shared global calendar and period selection.
  const { selectedDate, periodMode } = useDate();

  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Load forecast whenever the shared date or period changes.
  useEffect(() => {
    let active = true;

    const loadForecastData = async () => {
      try {
        setLoading(true);
        setError("");

        // Preserve the existing date-range helper.
        const dates = getPeriodDates(periodMode, selectedDate);

        console.log("FORECAST DATE PARAMETERS:", dates);

        const result = await getForecast({
          start: dates.start,
          end: dates.end,
        });

        if (!active) return;

        const data = Array.isArray(result)
          ? result
          : result?.forecast ?? [];

        if (!Array.isArray(data) || data.length === 0) {
          setForecast([]);
          setError(
            "No forecast data is available for the selected date. Try another date."
          );
          return;
        }

        setForecast(data);

        console.log("FORECAST DATA:", data);
      } catch (err) {
        console.error("Forecast API error:", err);

        if (active) {
          setForecast([]);
          setError(
            getErrorMessage(err, "Unable to load solar forecast.")
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadForecastData();

    return () => {
      active = false;
    };
  }, [selectedDate, periodMode, refreshKey]);

  // Prepare chart data.
  const chartData = useMemo(() => {
    return forecast
      .map((item) => ({
        day: item.date,
        radiation: Number(item.predicted_radiation),
        energy: Number(item.predicted_energy),
        saving: Number(item.predicted_saving),
      }))
      .filter((item) => Number.isFinite(item.radiation));
  }, [forecast]);

  // Calculate energy and savings.
  const validEnergy = chartData.filter((item) =>
    Number.isFinite(item.energy)
  );

  const validSavings = chartData.filter((item) =>
    Number.isFinite(item.saving)
  );

  const currentRadiation =
    chartData.length > 0 ? chartData[0].radiation : null;

  const periodEnergy =
    validEnergy.length > 0
      ? validEnergy.reduce((sum, item) => sum + item.energy, 0)
      : null;

  const periodSaving =
    validSavings.length > 0
      ? validSavings.reduce((sum, item) => sum + item.saving, 0)
      : null;

  const dailyEnergy =
    validEnergy.length > 0
      ? periodEnergy / validEnergy.length
      : null;

  const dailySaving =
    validSavings.length > 0
      ? periodSaving / validSavings.length
      : null;

  const monthlySaving =
    dailySaving !== null ? dailySaving * 30 : null;

  const yearlySaving =
    dailySaving !== null ? dailySaving * 365 : null;

  const savingsChartData = [
    { name: "Daily", value: dailySaving ?? 0 },
    { name: "Monthly", value: monthlySaving ?? 0 },
    { name: "Yearly", value: yearlySaving ?? 0 },
  ];

  const rangeLabels = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
  };

  const rangeLabel = rangeLabels[periodMode] || "Daily";

  // Loading state.
  if (loading) {
    return (
      <DashboardLayout showPeriodDropdown={true}>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  // Error state.
  if (error) {
    return (
      <DashboardLayout showPeriodDropdown={true}>
        <div className="p-6">
          <ErrorMessage
            message={error}
            onRetry={() => setRefreshKey((previous) => previous + 1)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showPeriodDropdown={true}>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                  <Sun size={20} className="text-white" />
                </div>

                <span className="text-sm font-semibold text-amber-600">
                  SOLAR INTELLIGENCE
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Solar Forecast
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Understand upcoming solar generation, energy potential
                and expected savings.
              </p>
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          {rangeLabel} solar forecast based on the selected global calendar
          period.
        </p>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          {/* Expected Radiation */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-white/80">
                  Expected Radiation
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {formatValue(currentRadiation)}
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  kWh/m²/day
                </p>
              </div>

              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
                <Sun size={25} />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1 text-sm text-white/90">
              <TrendingUp size={16} />
              AI-powered prediction
            </div>
          </div>

          {/* Average Daily Energy */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average Daily Energy
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {formatValue(dailyEnergy)}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  kWh/day
                </p>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <Zap size={24} className="text-emerald-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-emerald-600">
              <ArrowUpRight size={16} />
              Average for forecast period
            </div>
          </div>

          {/* Forecast Savings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Forecast Savings
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {periodSaving === null
                    ? "N/A"
                    : `₹${formatValue(periodSaving)}`}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Forecast period
                </p>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <IndianRupee size={24} className="text-blue-500" />
              </div>
            </div>

            <div className="mt-5 text-sm text-blue-600">
              Calculated from AI forecast predictions
            </div>
          </div>

          {/* Forecast Energy */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Forecast Energy
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {formatValue(periodEnergy)}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  kWh
                </p>
              </div>

              <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                <TrendingUp size={24} className="text-violet-500" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-violet-600">
              <Sparkles size={16} />
              Predicted energy total
            </div>
          </div>
        </div>

        {/* MAIN FORECAST CHART */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

          <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Solar Generation Forecast
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Expected solar radiation across the forecast period.
              </p>
            </div>

            <div className="h-[350px]">
              <WeeklyForecastChart data={chartData} />
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-amber-400/20 p-3">
                <Sparkles className="text-amber-400" size={22} />
              </div>

              <div>
                <h3 className="font-semibold">
                  AI Forecast Insight
                </h3>

                <p className="text-xs text-slate-400">
                  ArkaAI prediction engine
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-400">
                  First day expected radiation
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatValue(currentRadiation)}
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    kWh/m²/day
                  </span>
                </p>
              </div>

              <div className="h-px bg-slate-800" />

              <div>
                <p className="text-sm text-slate-400">
                  Average daily generation
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {formatValue(dailyEnergy)}
                  <span className="ml-1 text-sm font-normal text-slate-400">
                    kWh
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  Use high-consumption appliances during periods of
                  stronger solar generation to maximize your savings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ADDITIONAL CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Energy Outlook */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Energy Outlook
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Visualize your expected solar generation.
              </p>
            </div>

            <div className="h-[320px]">
              <ForecastChart data={chartData} />
            </div>
          </div>

          {/* Savings Projection */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Savings Projection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Daily, monthly and yearly estimates based on forecast averages.
              </p>
            </div>

            <div className="h-[320px]">
              <SavingsChart data={savingsChartData} />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ForecastPage;
