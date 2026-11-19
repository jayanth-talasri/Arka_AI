import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import KPICard from "../components/cards/KPICard";
import WeatherCard from "../components/cards/WeatherCard";
import SavingsCard from "../components/cards/SavingsCard";
import RecommendationCard from "../components/cards/RecommendationCard";
import Loader from "../components/common/Loader";
import { useDate } from "../context/DateContext";
import ErrorMessage from "../components/common/ErrorMessage";
import { getDashboardComparison } from "../services/dashboardService";
import { calculateGrowth, getErrorMessage } from "../services/apiHelper";
const getToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getRangeValue = (analytics, range, metric) => {
  const fields = {
    energy: { daily: "daily_energy", weekly: "weekly_energy", monthly: "monthly_energy", yearly: "yearly_energy" },
    savings: { daily: "daily_saving", weekly: "weekly_saving", monthly: "monthly_saving", yearly: "yearly_saving" }
  };
  const field = fields[metric]?.[range];
  const directValue = analytics?.[field];
  if (directValue !== undefined && directValue !== null && Number.isFinite(Number(directValue))) return Number(directValue);
  const periodField = metric === "energy" ? "period_energy" : "period_saving";
  const periodValue = analytics?.[periodField];
  if (range === "daily" && periodValue !== undefined && periodValue !== null && Number.isFinite(Number(periodValue))) return Number(periodValue);
  return null;
};
const formatValue = (value, digits = 2) => (
  value === null || value === undefined || !Number.isFinite(Number(value))
    ? "N/A"
    : Number(value).toFixed(digits)
);
const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [previousDashboard, setPreviousDashboard] = useState(null);
  const [range, setRange] = useState("daily");
  const {selectedDate } = useDate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getDashboardComparison({ range, selectedDate });
        if (!active) return;
        setDashboard(result.current);
        setPreviousDashboard(result.previous);
        console.log("CURRENT DASHBOARD:", result.current);
        console.log("PREVIOUS DASHBOARD:", result.previous);
        console.log("COMPARISON DATES:", result.dates);
      } catch (err) {
        console.error("Dashboard error:", err);
        if (active) setError(getErrorMessage(err, "Unable to load dashboard."));
      } finally {
        if (active) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      active = false;
    };
  }, [range, selectedDate]);
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </DashboardLayout>
    );
  }
  if (!dashboard) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">No dashboard data available.</p>
      </DashboardLayout>
    );
  }
  const prediction = dashboard.prediction ?? {};
  const analytics = dashboard.analytics ?? {};
  const weather = dashboard.weather ?? {};
  const appliances = dashboard.appliances ?? {};
  const previousPrediction = previousDashboard?.prediction ?? {};
  const previousAnalytics = previousDashboard?.analytics ?? {};
  const energy = getRangeValue(analytics, range, "energy");
  const previousEnergy = getRangeValue(previousAnalytics, range, "energy");
  const savings = getRangeValue(analytics, range, "savings");
  const previousSavings = getRangeValue(previousAnalytics, range, "savings");
  const radiationGrowth = calculateGrowth(prediction.predicted_radiation, previousPrediction.predicted_radiation);
  const energyGrowth = calculateGrowth(energy, previousEnergy);
  const savingsGrowth = calculateGrowth(savings, previousSavings);
  const efficiencyGrowth = calculateGrowth(analytics.panel_efficiency, previousAnalytics.panel_efficiency);
  const rangeLabel = { daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" }[range];
  const recommendedAppliances = appliances.recommended ?? [];
  const savingsStatus = dashboard.data_status?.savings || dashboard.data_status?.overall || "estimated";
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to ArkaAI ☀️</h1>
          <p className="text-gray-500 mt-2">Monitor your solar performance and energy insights.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-amber-400">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
      </div>
      <p className="mb-5 text-sm text-gray-500">{rangeLabel} performance compared with the previous {range === "daily" ? "day" : range === "weekly" ? "week" : range === "monthly" ? "month" : "year"}.</p>
      <div className="grid grid-cols-1 gap-5 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Solar Radiation" value={formatValue(prediction.predicted_radiation)} unit={prediction.unit ?? "kWh/m²/day"} trend={radiationGrowth} />
        <KPICard title={`${rangeLabel} Energy`} value={formatValue(energy)} unit="kWh" trend={energyGrowth} />
        <KPICard title={`${rangeLabel} Savings`} value={savings === null ? "N/A" : `₹${formatValue(savings)}`} trend={savingsGrowth} />
        <KPICard title="Panel Efficiency" value={formatValue(analytics.panel_efficiency)} unit="%" trend={efficiencyGrowth} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherCard weather={weather} selectedDate={selectedDate} range={range} />
        <SavingsCard amount={savings} range={range} status={savingsStatus} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Recommended Appliances</h2>
          <p className="text-sm text-gray-500 mt-1">Best appliances to use during peak solar generation.</p>
        </div>
        {recommendedAppliances.length > 0 ? (
          <div className="space-y-3">
            {recommendedAppliances.map((item, index) => (
              <RecommendationCard key={`${item}-${index}`} appliance={item} time={appliances.best_time || "Best solar hours"} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No appliance recommendations available yet.</p>
            <p className="text-sm text-gray-400 mt-2">Configure your appliances in Settings to receive personalized recommendations.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default DashboardPage;