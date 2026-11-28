import { useEffect, useState } from "react";
import {
  Sun,
  Zap,
  Wallet,
  Gauge,
  Sparkles,
  Clock3,
  PlugZap,
  CloudSun,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarCheck,
  Sunrise,
  Sunset,
  Lightbulb,
  BatteryCharging
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import WeatherCard from "../components/cards/WeatherCard";
import SavingsCard from "../components/cards/SavingsCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDate } from "../context/DateContext";
import { getDashboardComparison } from "../services/dashboardService";
import { calculateGrowth, getErrorMessage } from "../services/apiHelper";
const formatValue = (value, digits = 2) => {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "N/A";
  }
  return Number(value).toFixed(digits);
};
const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
};
const getApplianceIcon = (name = "") => {
  const value = name.toLowerCase();
  if (value.includes("vehicle") || value.includes("charger") || value.includes("ev")) {
    return PlugZap;
  }
  if (value.includes("heater") || value.includes("pump")) {
    return Activity;
  }
  if (value.includes("dishwasher") || value.includes("washing")) {
    return Zap;
  }
  if (value.includes("light") || value.includes("fan")) {
    return Lightbulb;
  }
  return BatteryCharging;
};
const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  comparisonLabel = "compared with previous day"
}) => {
  const validTrend = trend !== null && trend !== undefined && Number.isFinite(Number(trend));
  const trendValue = validTrend ? Number(trend) : null;
  const TrendIcon = !validTrend ? Minus : trendValue > 0 ? TrendingUp : trendValue < 0 ? TrendingDown : Minus;
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{value}</h2>
            {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={`rounded-xl p-3 ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-5 text-xs">
        <TrendIcon
          size={15}
          className={trendValue > 0 ? "text-green-600" : trendValue < 0 ? "text-red-500" : "text-gray-400"}
        />
        {validTrend ? (
          <>
            <span className={`font-semibold ${trendValue > 0 ? "text-green-600" : trendValue < 0 ? "text-red-500" : "text-gray-500"}`}>
              {Math.abs(trendValue).toFixed(1)}%
            </span>
            <span className="text-gray-400">{comparisonLabel}</span>
          </>
        ) : (
          <span className="text-gray-400">Comparison data unavailable</span>
        )}
      </div>
    </div>
  );
};
const DashboardPage = () => {
  const { selectedDate, periodMode } = useDate();
  const [dashboard, setDashboard] = useState(null);
  const [previousDashboard, setPreviousDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const periodLabels = {
    daily: "previous day",
    weekly: "previous week",
    monthly: "previous month",
    yearly: "previous year"
  };
  const comparisonLabel = `compared with ${periodLabels[periodMode] || "previous period"}`;
  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getDashboardComparison({
          range: periodMode,
          selectedDate
        });
        if (!active) return;
        setDashboard(result.current);
        setPreviousDashboard(result.previous);
        console.log("CURRENT DASHBOARD:", result.current);
        console.log("PREVIOUS DASHBOARD:", result.previous);
        console.log("COMPARISON DATES:", result.dates);
      } catch (err) {
        console.error("Dashboard error:", err);
        if (active) {
          setError(getErrorMessage(err, "Unable to load dashboard."));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      active = false;
    };
  }, [selectedDate, periodMode]);
  if (loading) {
    return (
      <DashboardLayout showPeriodDropdown={true}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout showPeriodDropdown={true}>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }
  if (!dashboard) {
    return (
      <DashboardLayout showPeriodDropdown={true}>
        <p className="text-gray-500">No dashboard data available.</p>
      </DashboardLayout>
    );
  }
  const prediction = dashboard.prediction ?? {};
  const analytics = dashboard.analytics ?? {};
  const savingsData = dashboard.savings ?? {};
  const weather = dashboard.weather ?? {};
  const appliances = dashboard.appliances ?? {};
  const previousPrediction = previousDashboard?.prediction ?? {};
  const previousAnalytics = previousDashboard?.analytics ?? {};
  const periodMetricKeys = {
    daily: {
      energy: "daily_energy",
      savings: "daily_saving",
      energyLabel: "Daily Energy",
      savingsLabel: "Daily Savings",
      rangeLabel: "daily"
    },
    weekly: {
      energy: "weekly_energy",
      savings: "weekly_saving",
      energyLabel: "Weekly Energy",
      savingsLabel: "Weekly Savings",
      rangeLabel: "weekly"
    },
    monthly: {
      energy: "monthly_energy",
      savings: "monthly_saving",
      energyLabel: "Monthly Energy",
      savingsLabel: "Monthly Savings",
      rangeLabel: "monthly"
    },
    yearly: {
      energy: "yearly_energy",
      savings: "yearly_saving",
      energyLabel: "Yearly Energy",
      savingsLabel: "Yearly Savings",
      rangeLabel: "yearly"
    }
  };
  const selectedMetrics = periodMetricKeys[periodMode] || periodMetricKeys.daily;
  const energy =
  analytics[selectedMetrics.energy] ?? analytics.period_energy ?? null;

  const previousEnergy =
  previousAnalytics[selectedMetrics.energy] ?? previousAnalytics.period_energy ?? null;

  const savings =
  savingsData[selectedMetrics.savings] ?? savingsData.period_saving ?? null;

  const previousSavings =
  previousDashboard?.savings?.[selectedMetrics.savings] ??
  previousDashboard?.savings?.period_saving ??
  null;
  const radiationGrowth = calculateGrowth(
    prediction.predicted_radiation,
    previousPrediction.predicted_radiation
  );
  const energyGrowth = calculateGrowth(energy, previousEnergy);
  const savingsGrowth = calculateGrowth(savings, previousSavings);
  const efficiencyGrowth = calculateGrowth(
    analytics.panel_efficiency,
    previousAnalytics.panel_efficiency
  );
  const recommendedAppliances = Array.isArray(appliances.recommended) ? appliances.recommended : [];
  const applianceSchedules = appliances.appliance_schedules ?? appliances.appliance_schedule ?? [];
  const solarWindow = appliances.solar_window ?? {};
  const solarStatus = dashboard.recommendation?.status || appliances.status || "Solar Insights";
  const solarMessage = dashboard.recommendation?.message || appliances.recommendation_notes?.[0] || "Review your solar performance and appliance recommendations for the selected date.";
  const savingsStatus = dashboard.data_status?.savings || dashboard.data_status?.overall || "estimated";
  return (
    <DashboardLayout showPeriodDropdown={true}>
      <div className="space-y-7">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Sun size={27} className="text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome to ArkaAI</h1>
                <p className="text-gray-500 mt-1">Your intelligent solar energy overview.</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3">
            <CalendarCheck size={20} className="text-amber-500" />
            <div>
              <p className="text-xs text-gray-400">Global calendar selection</p>
              <p className="font-semibold text-gray-800">{formatDate(selectedDate)}</p>
            </div>
          </div>
        </div>
        {/* PERFORMANCE SUMMARY */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity size={17} className="text-amber-500" />
          <p>
            Solar and energy performance for the selected {periodMode} period, {comparisonLabel}.
          </p>
        </div>
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <MetricCard
            title="Solar Radiation"
            value={formatValue(prediction.predicted_radiation)}
            unit={prediction.unit ?? "kWh/m┬▓/day"}
            trend={radiationGrowth}
            comparisonLabel={comparisonLabel}
            icon={Sun}
            color="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <MetricCard
            title={selectedMetrics.energyLabel}
            value={formatValue(energy)}
            unit="kWh"
            trend={energyGrowth}
            comparisonLabel={comparisonLabel}
            icon={Zap}
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <MetricCard
            title={selectedMetrics.savingsLabel}
            value={savings === null || savings === undefined ? "N/A" : `₹ ${formatValue(savings)}`}
            trend={savingsGrowth}
            comparisonLabel={comparisonLabel}
            icon={Wallet}
            color="bg-gradient-to-br from-emerald-500 to-green-600"
          />
          <MetricCard
            title="Panel Efficiency"
            value={formatValue(analytics.panel_efficiency)}
            unit="%"
            trend={efficiencyGrowth}
            comparisonLabel={comparisonLabel}
            icon={Gauge}
            color="bg-gradient-to-br from-violet-500 to-purple-600"
          />
        </div>
        {/* SOLAR INSIGHT */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-100 rounded-2xl p-6">
          <div className="absolute -right-8 -top-10 opacity-10">
            <Sun size={180} className="text-amber-500" />
          </div>
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <Sparkles size={26} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-amber-700">ARKAAI SOLAR INSIGHT</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{solarStatus}</h2>
                <p className="text-sm text-gray-600 mt-2 max-w-2xl">{solarMessage}</p>
              </div>
            </div>
            <div className="bg-white/90 rounded-xl px-5 py-4 min-w-[190px] shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Sun size={17} className="text-amber-500" />
                Solar Radiation
              </div>
              <p className="text-3xl font-bold text-amber-600 mt-2">{formatValue(prediction.predicted_radiation)}</p>
              <p className="text-xs text-gray-500 mt-1">{prediction.unit ?? "kWh/m┬▓/day"}</p>
            </div>
          </div>
        </div>
        {/* SOLAR DAYLIGHT INFORMATION */}
        {(solarWindow.sunrise || solarWindow.sunset) && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <Sunrise size={21} className="text-amber-500" />
              <h2 className="font-semibold text-gray-900">Solar Daylight Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 rounded-xl p-4">
                <Sunrise size={22} className="text-amber-600" />
                <p className="text-sm text-gray-500 mt-2">Sunrise</p>
                <p className="text-xl font-bold text-gray-900">{solarWindow.sunrise ?? "N/A"}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <Sun size={22} className="text-orange-600" />
                <p className="text-sm text-gray-500 mt-2">Solar Noon</p>
                <p className="text-xl font-bold text-gray-900">{solarWindow.solar_noon ?? "N/A"}</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <Sunset size={22} className="text-indigo-600" />
                <p className="text-sm text-gray-500 mt-2">Sunset</p>
                <p className="text-xl font-bold text-gray-900">{solarWindow.sunset ?? "N/A"}</p>
              </div>
            </div>
          </div>
        )}
        {/* WEATHER AND SAVINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherCard weather={weather} selectedDate={selectedDate} range="daily" />
          <SavingsCard
            amount={savings}
            range={selectedMetrics.rangeLabel}
            status={savingsStatus} 
          />
        </div>
        {/* APPLIANCE RECOMMENDATIONS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <PlugZap size={22} className="text-amber-500" />
                <h2 className="text-xl font-semibold text-gray-900">Recommended Appliances</h2>
              </div>
              <p className="text-sm text-gray-500 mt-2">Personalized appliance recommendations based on solar availability.</p>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-2 rounded-lg">
              {recommendedAppliances.length} recommended
            </span>
          </div>
          {recommendedAppliances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendedAppliances.map((item, index) => {
                const name = typeof item === "string" ? item : item.name || "Appliance";
                const schedule = Array.isArray(applianceSchedules)
                  ? applianceSchedules.find(
                      (entry) => (entry.appliance || entry.name || "").toLowerCase() === name.toLowerCase()
                    )
                  : null;
                const ApplianceIcon = getApplianceIcon(name);
                const time = schedule?.best_time || (
                  schedule?.start_time && schedule?.end_time
                    ? `${schedule.start_time} - ${schedule.end_time}`
                    : "Individual schedule unavailable"
                );
                return (
                  <div
                    key={`${name}-${index}`}
                    className="group border border-gray-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-50 rounded-xl p-3 group-hover:bg-amber-100 transition">
                        <ApplianceIcon size={24} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{name}</h3>
                        <p className="text-xs text-green-600 mt-1">Recommended for solar operation</p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock3 size={16} />
                        Recommended operating time
                      </div>
                      <p className="text-lg font-bold text-blue-600 mt-2">{time}</p>
                      {schedule?.duration_hours != null && (
                        <p className="text-xs text-gray-500 mt-2">Duration: {schedule.duration_hours} hours</p>
                      )}
                      {schedule?.estimated_energy_kwh != null && (
                        <p className="text-xs text-gray-500 mt-1">Estimated energy: {schedule.estimated_energy_kwh} kWh</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center bg-gray-50 rounded-xl">
              <PlugZap size={38} className="mx-auto text-gray-400" />
              <p className="text-gray-600 mt-3 font-medium">No appliance recommendations available.</p>
              <p className="text-sm text-gray-400 mt-2">Configure your appliances in Settings to receive personalized recommendations.</p>
            </div>
          )}
          {Array.isArray(appliances.not_recommended) && appliances.not_recommended.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Not recommended for solar-only operation</h3>
              <div className="flex flex-wrap gap-2">
                {appliances.not_recommended.map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    className="bg-red-50 text-red-600 border border-red-100 rounded-lg px-3 py-2 text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* DATA OVERVIEW */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-xl">
                <CloudSun size={23} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Solar Data Overview</h3>
                <p className="text-sm text-gray-500 mt-1">Performance data for {formatDate(selectedDate)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Data status:{" "}
              <span className="font-semibold text-gray-700">
                {dashboard.data_status?.overall || "Available"}
              </span>
            </div>
          </div>
          {appliances.solar_data_source && (
            <p className="text-xs text-gray-400 mt-4">
              Solar data source: {appliances.solar_data_source}
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default DashboardPage;