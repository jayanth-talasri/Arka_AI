
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import useHistory from "../hooks/useHistory";
import { useDate } from "../context/DateContext";
import { getQueryDatesForPage } from "../utils/dateAdapter";

import {
  Sun,
  Zap,
  Wallet,
  Leaf,
  CalendarDays,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Database,
  Activity,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "--";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatChartDate = (date) => {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const formatNumber = (value, digits = 2) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "0.00";
};

const HistoryPage = () => {
  const { selectedDate, periodMode } = useDate();

  const dates = useMemo(
    () => getQueryDatesForPage("history", selectedDate, periodMode),
    [selectedDate, periodMode]
  );

  const { history, loading, error } = useHistory(
    dates.start,
    dates.end
  );

  // Backend history records
  const historyData = useMemo(() => {
    if (!history) return [];

    if (Array.isArray(history.nasa_history?.history)) {
      return history.nasa_history.history;
    }

    if (Array.isArray(history.history)) {
      return history.history;
    }

    if (Array.isArray(history.data)) {
      return history.data;
    }

    return [];
  }, [history]);

  // Prepare chart records
  const chartData = useMemo(() => {
    return historyData.map((item, index) => ({
      date: item.date,
      day: formatChartDate(item.date) || `Day ${index + 1}`,
      radiation: Number(item.radiation) || 0,
      energy: Number(item.energy) || 0,
      savings: Number(item.savings) || 0,
    }));
  }, [historyData]);

  // Backend summary
  const summary =
   history?.nasa_history?.summary || history?.summary || {};

  // Fallback calculations if a summary field is unavailable
  const calculatedSummary = useMemo(() => {
    const totalRadiation = chartData.reduce(
      (sum, item) => sum + item.radiation,
      0
    );

    const totalEnergy = chartData.reduce(
      (sum, item) => sum + item.energy,
      0
    );

    const totalSavings = chartData.reduce(
      (sum, item) => sum + item.savings,
      0
    );

    const totalCO2 = historyData.reduce(
      (sum, item) => sum + (Number(item.co2_saved) || 0),
      0
    );

    const days = chartData.length;

    return {
      average_radiation: days ? totalRadiation / days : 0,
      total_energy: totalEnergy,
      total_savings: totalSavings,
      co2_saved: totalCO2,
    };
  }, [chartData, historyData]);

  const averageRadiation =
    summary.average_radiation ?? calculatedSummary.average_radiation;

  const totalEnergy =
    summary.total_energy ?? calculatedSummary.total_energy;

  const totalSavings =
    summary.total_savings ?? calculatedSummary.total_savings;

  const co2Saved =
    summary.co2_saved ?? calculatedSummary.co2_saved;

  const location = 
    history?.settings?.location ? history.settings
    : history?.nasa_history?.location || history?.location || {};

  const dataSource =
    history?.nasa_history?.data_source || history?.data_source || "NASA POWER with Open-Meteo fallback";

  const kpiCards = [
    {
      title: "Total Energy",
      value: formatNumber(totalEnergy),
      unit: "kWh",
      icon: Zap,
      iconStyle: "bg-amber-100 text-amber-600",
      badge: "Generation",
      badgeStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Savings",
      value: `₹${formatNumber(totalSavings)}`,
      unit: "Estimated savings",
      icon: Wallet,
      iconStyle: "bg-emerald-100 text-emerald-600",
      badge: "Financial",
      badgeStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Average Radiation",
      value: formatNumber(averageRadiation),
      unit: "kWh/m²/day",
      icon: Sun,
      iconStyle: "bg-orange-100 text-orange-600",
      badge: "Solar input",
      badgeStyle: "bg-orange-50 text-orange-600",
    },
    {
      title: "CO₂ Saved",
      value: formatNumber(co2Saved),
      unit: "kg CO₂ equivalent",
      icon: Leaf,
      iconStyle: "bg-green-100 text-green-600",
      badge: "Environment",
      badgeStyle: "bg-green-50 text-green-600",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout showPeriodDropdown>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout showPeriodDropdown>
        <div className="p-6">
          <ErrorMessage message={error} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showPeriodDropdown>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                  <Sun size={20} className="text-white" />
                </div>

                <span className="text-sm font-semibold tracking-wide text-amber-600">
                  SOLAR INTELLIGENCE
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Energy History
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Explore historical solar generation, financial savings
                and environmental performance.
              </p>
            </div>

            {/* LOCATION AND PERIOD */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <MapPin size={19} className="text-amber-500" />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Solar Location
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  {Number.isFinite(Number(location.latitude)) &&
                  Number.isFinite(Number(location.longitude))
                    ? `${Number(location.latitude).toFixed(3)}, ${Number(location.longitude).toFixed(3)}`
                    : "Configured Location"}
                </p>
              </div>

              <div className="mx-2 hidden h-9 border-l border-slate-200 sm:block" />

              <div>
                <p className="text-xs text-slate-400">
                  Selected Period
                </p>

                <p className="text-sm font-semibold capitalize text-slate-700">
                  {periodMode}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${card.iconStyle}`}>
                    <Icon size={22} />
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 md:text-3xl">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {card.unit}
                </p>
              </div>
            );
          })}
        </div>

        {/* SOLAR RADIATION CHART */}
        <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sun size={20} className="text-amber-500" />

                <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                  Solar Radiation Analysis
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Daily solar radiation received at your selected location.
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
              kWh/m²/day
            </span>
          </div>

          <div className="h-[320px] w-full md:h-[360px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="historyRadiationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f59e0b"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#f59e0b"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${formatNumber(value)} kWh/m²/day`,
                      "Radiation",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="radiation"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#historyRadiationGradient)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No historical radiation data available.
              </div>
            )}
          </div>
        </div>

        {/* ENERGY GENERATION CHART */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-orange-500" />

                <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                  Daily Energy Generation
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Estimated daily solar energy generated from available radiation.
              </p>
            </div>

            <span className="w-fit rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
              kWh
            </span>
          </div>

          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  barSize={periodMode === "daily" ? 42 : 24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${formatNumber(value)} kWh`,
                      "Energy",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    }}
                  />

                  <Bar
                    dataKey="energy"
                    fill="#f59e0b"
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No energy generation data available.
              </div>
            )}
          </div>
        </div>

        {/* DAILY HISTORY TABLE */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays size={20} className="text-amber-500" />

                <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                  Daily Historical Records
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Detailed solar production and weather observations.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {historyData.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Radiation</th>
                  <th className="px-5 py-4 font-semibold">Energy</th>
                  <th className="px-5 py-4 font-semibold">Savings</th>
                  <th className="px-5 py-4 font-semibold">Temperature</th>
                  <th className="px-5 py-4 font-semibold">Humidity</th>
                  <th className="px-5 py-4 font-semibold">Wind Speed</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {historyData.length > 0 ? (
                  historyData.map((item, index) => (
                    <tr
                      key={item.date || index}
                      className="transition hover:bg-amber-50/40"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                        {formatDate(item.date)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-amber-600">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <Sun size={15} />
                          {formatNumber(item.radiation)} kWh/m²
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                        {formatNumber(item.energy)} kWh
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-emerald-600">
                        ₹{formatNumber(item.savings)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Thermometer size={15} className="text-orange-500" />
                          {formatNumber(item.temperature)}°C
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Droplets size={15} className="text-blue-500" />
                          {formatNumber(item.humidity)}%
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-2">
                          <Wind size={15} className="text-slate-400" />
                          {formatNumber(item.wind_speed)} m/s
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No historical records available for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DATA SOURCE */}
        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Database size={17} className="text-amber-500" />

            <span className="text-sm font-medium text-slate-600">
              Data Source
            </span>
          </div>

          <span className="text-xs font-medium text-slate-500">
            {dataSource}
          </span>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
