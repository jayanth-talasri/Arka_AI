import { useEffect, useMemo, useState } from "react";
import {
  Sun,
  TrendingUp,
  Zap,
  IndianRupee,
  CalendarDays,
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
import { getSavings } from "../services/savingsService";

const ForecastPage = () => {
  const [forecast, setForecast] = useState([]);
  const [savings, setSavings] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadForecastData = async () => {
      try {
        setLoading(true);
        setError("");

        const [forecastData, savingsData] =
          await Promise.all([
            getForecast(),
            getSavings(),
          ]);

        setForecast(
          Array.isArray(forecastData?.forecast)
            ? forecastData.forecast
            : []
        );

        setSavings(savingsData || {});
      } catch (err) {
        console.error(
          "Forecast page error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Unable to load forecast data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadForecastData();
  }, []);

  const chartData = useMemo(() => {
    return forecast.map((item, index) => ({
      day:
        item.date ||
        `Day ${index + 1}`,

      radiation: Number(
        item.predicted_radiation ?? 0
      ),
    }));
  }, [forecast]);

  const currentRadiation =
    chartData.length > 0
      ? chartData[0].radiation
      : 0;

  const dailyEnergy = Number(
    savings?.daily_energy ?? 0
  );

  const dailySaving = Number(
    savings?.daily_saving ?? 0
  );

  const monthlySaving = Number(
    savings?.monthly_saving ?? 0
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
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
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">

        {/* HEADER */}

        <div className="mb-8">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">

                  <Sun
                    size={20}
                    className="text-white"
                  />

                </div>

                <span className="text-sm font-semibold text-amber-600">
                  SOLAR INTELLIGENCE
                </span>

              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Solar Forecast
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Understand upcoming solar generation,
                energy potential and expected savings.
              </p>

            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <CalendarDays
                size={18}
                className="text-slate-500"
              />

              <div>

                <p className="text-xs text-slate-400">
                  Forecast Period
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  7 Day Forecast
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* KPI CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">

            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between">

              <div>

                <p className="text-sm text-white/80">
                  Expected Radiation
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {currentRadiation.toFixed(2)}
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


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Daily Energy
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {dailyEnergy.toFixed(2)}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  kWh/day
                </p>

              </div>

              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">

                <Zap
                  size={24}
                  className="text-emerald-500"
                />

              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-emerald-600">

              <ArrowUpRight size={16} />

              Estimated production

            </div>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Daily Savings
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  ₹{dailySaving.toFixed(2)}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  estimated savings
                </p>

              </div>

              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                <IndianRupee
                  size={24}
                  className="text-blue-500"
                />

              </div>

            </div>

            <div className="mt-5 text-sm text-blue-600">
              Based on current solar output
            </div>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Monthly Savings
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  ₹{monthlySaving.toFixed(2)}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  projected monthly
                </p>

              </div>

              <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center">

                <TrendingUp
                  size={24}
                  className="text-violet-500"
                />

              </div>

            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-violet-600">

              <Sparkles size={16} />

              Solar ROI potential

            </div>

          </div>

        </div>


        {/* MAIN FORECAST */}

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

              <WeeklyForecastChart
                data={chartData}
              />

            </div>

          </div>


          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="rounded-xl bg-amber-400/20 p-3">

                <Sparkles
                  className="text-amber-400"
                  size={22}
                />

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
                  Current expected output
                </p>

                <p className="mt-1 text-2xl font-bold">

                  {currentRadiation.toFixed(2)}

                  <span className="ml-1 text-sm font-normal text-slate-400">
                    kWh/m²/day
                  </span>

                </p>

              </div>


              <div className="h-px bg-slate-800" />


              <div>

                <p className="text-sm text-slate-400">
                  Expected daily generation
                </p>

                <p className="mt-1 text-2xl font-bold">

                  {dailyEnergy.toFixed(2)}

                  <span className="ml-1 text-sm font-normal text-slate-400">
                    kWh
                  </span>

                </p>

              </div>


              <div className="rounded-2xl bg-white/5 p-4">

                <p className="text-sm leading-6 text-slate-300">
                  Use high-consumption appliances during
                  periods of stronger solar generation to
                  maximize your savings.
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Weekly Energy Outlook
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Visualize your expected solar generation.
              </p>

            </div>

            <div className="h-[320px]">

              <ForecastChart
                data={chartData}
              />

            </div>

          </div>


          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Savings Projection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Estimated financial benefits from your solar system.
              </p>

            </div>

            <div className="h-[320px]">

              <SavingsChart
                data={[
                  {
                    name: "Daily",
                    value: Number(savings.daily_saving || 0),
                  },
                  {
                    name: "Monthly",
                    value: Number(savings.monthly_saving || 0),
                  },
                  {
                    name: "Yearly",
                    value: Number(savings.yearly_saving || 0),
                  },
                ]}
              />

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ForecastPage;