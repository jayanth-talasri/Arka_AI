
import { useEffect, useState } from "react";
import {
  BarChart3,
  Zap,
  IndianRupee,
  Leaf,
  Gauge,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import AnalyticsCard from "../components/cards/AnalyticsCard";
import KPICard from "../components/cards/KPICard";
import EnergyChart from "../charts/EnergyChart";
import SavingsChart from "../charts/SavingsChart";
import { getAnalytics } from "../services/analyticsService";
import { getSolarScore } from "../services/solarScoreService";
import { getInsights } from "../services/insightsService";
import { useDate } from "../context/DateContext";
import { getQueryDatesForPage } from "../utils/dateAdapter";

const getApiError = (error, fallback) => {
  const data = error?.response?.data;
  return (
    data?.error?.detail ||
    data?.error?.message ||
    data?.detail ||
    data?.message ||
    error?.message ||
    fallback
  );
};

const hasData = (data) =>
  data && typeof data === "object" && Object.keys(data).length > 0;

const UnavailableMessage = ({ message }) => (
  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
    {message || "Data is currently unavailable for the selected date."}
  </div>
);

const AnalyticalPage = () => {
  const { selectedDate, periodMode } = useDate();

  const [analytics, setAnalytics] = useState(null);
  const [solarScore, setSolarScore] = useState(null);
  const [insights, setInsights] = useState([]);

  const [analyticsError, setAnalyticsError] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [insightsError, setInsightsError] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadAnalytics = async () => {
      setLoading(true);
      setAnalytics(null);
      setSolarScore(null);
      setInsights([]);
      setAnalyticsError("");
      setScoreError("");
      setInsightsError("");

      try {
        const dates = getQueryDatesForPage(
          "analytics",
          selectedDate,
          periodMode
        );

        console.log("ANALYTICS DATE RANGE:", dates);

        const results = await Promise.allSettled([
          getAnalytics(dates),
          getSolarScore(dates),
          getInsights(dates),
        ]);

        if (!isActive) return;

        const [analyticsResult, scoreResult, insightsResult] = results;

        // ANALYTICS RESULT
        if (analyticsResult.status === "fulfilled") {
          if (hasData(analyticsResult.value)) {
            setAnalytics(analyticsResult.value);
          } else {
            setAnalyticsError(
              "No analytics records are available for the selected date."
            );
          }
        } else {
          console.error("Analytics API error:", analyticsResult.reason);
          setAnalyticsError(
            getApiError(
              analyticsResult.reason,
              "Unable to load energy analytics."
            )
          );
        }

        // SOLAR SCORE RESULT
        if (scoreResult.status === "fulfilled") {
          if (hasData(scoreResult.value)) {
            setSolarScore(scoreResult.value);
          } else {
            setScoreError(
              "Solar performance score is unavailable for this date."
            );
          }
        } else {
          console.error("Solar score API error:", scoreResult.reason);
          setScoreError(
            getApiError(
              scoreResult.reason,
              "Unable to load solar performance score."
            )
          );
        }

        // AI INSIGHTS RESULT
        if (insightsResult.status === "fulfilled") {
          setInsights(
            Array.isArray(insightsResult.value)
              ? insightsResult.value
              : []
          );
        } else {
          console.error("Insights API error:", insightsResult.reason);
          setInsightsError(
            getApiError(
              insightsResult.reason,
              "Unable to generate AI insights for this date."
            )
          );
        }
      } catch (error) {
        console.error("Analytics page error:", error);
        if (isActive) {
          setAnalyticsError("Unable to load Analytics page data.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, [selectedDate, periodMode]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const energyData = analytics
    ? [
        {
          name: "Daily",
          value: Number(analytics.daily_energy || 0),
        },
        {
          name: "Monthly",
          value: Number(analytics.monthly_energy || 0),
        },
        {
          name: "Yearly",
          value: Number(analytics.yearly_energy || 0),
        },
      ]
    : [];

  const savingsData = analytics
    ? [
        {
          name: "Daily",
          value: Number(analytics.daily_saving || 0),
        },
        {
          name: "Monthly",
          value: Number(analytics.monthly_saving || 0),
        },
        {
          name: "Yearly",
          value: Number(analytics.yearly_saving || 0),
        },
      ]
    : [];

  const formatValue = (value) =>
    Number(value || 0).toFixed(2);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* HEADER */}
        <div>
          <p className="text-sm text-gray-500">
            ArkaAI Analytics
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Energy Analytics
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor your solar generation, savings and environmental impact.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Selected date: {selectedDate}
          </p>
        </div>

        {/* ANALYTICS */}
        {analytics ? (
          <>
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <KPICard
                title="Daily Energy"
                value={formatValue(analytics.daily_energy)}
                unit="kWh"
                icon={Zap}
                color="from-amber-500 to-orange-500"
              />
              <KPICard
                title="Monthly Energy"
                value={formatValue(analytics.monthly_energy)}
                unit="kWh"
                icon={BarChart3}
                color="from-blue-500 to-cyan-500"
              />
              <KPICard
                title="Monthly Savings"
                value={`₹${formatValue(analytics.monthly_saving)}`}
                unit=""
                icon={IndianRupee}
                color="from-green-500 to-emerald-500"
              />
              <KPICard
                title="CO₂ Saved"
                value={formatValue(analytics.co2_saved)}
                unit="kg"
                icon={Leaf}
                color="from-green-600 to-teal-500"
              />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-w-0">
              <AnalyticsCard title="Energy Generation">
                <EnergyChart data={energyData} />
              </AnalyticsCard>
              <AnalyticsCard title="Savings Overview">
                <SavingsChart data={savingsData} />
              </AnalyticsCard>
            </div>

            {/* ENVIRONMENT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="CO₂ Reduction"
                value={formatValue(analytics.co2_saved)}
                unit="kg"
                icon={Leaf}
                color="from-green-500 to-emerald-500"
              />
              <KPICard
                title="Trees Equivalent"
                value={formatValue(analytics.trees_equivalent)}
                unit="trees"
                icon={Leaf}
                color="from-green-600 to-lime-500"
              />
              <KPICard
                title="Panel Efficiency"
                value={formatValue(analytics.panel_efficiency)}
                unit="%"
                icon={TrendingUp}
                color="from-purple-500 to-indigo-500"
              />
            </div>
          </>
        ) : (
          <AnalyticsCard title="Energy Analytics">
            <UnavailableMessage message={analyticsError} />
          </AnalyticsCard>
        )}

        {/* SOLAR SCORE */}
        <AnalyticsCard title="Solar Performance Score">
          {solarScore ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-gray-500">
                  Overall solar performance
                </p>
                <div className="flex items-end gap-3 mt-2">
                  <span className="text-5xl font-bold">
                    {solarScore.solar_score ?? 0}
                  </span>
                  <span className="text-gray-400 mb-2">
                    / 100
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  <Gauge size={38} className="text-amber-500" />
                </div>
                <p className="font-semibold mt-2">
                  Grade {solarScore.grade || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  {solarScore.status || "Unknown"}
                </p>
              </div>
            </div>
          ) : (
            <UnavailableMessage message={scoreError} />
          )}
        </AnalyticsCard>

        {/* AI INSIGHTS */}
        <AnalyticsCard title="AI Insights">
          {insightsError ? (
            <UnavailableMessage message={insightsError} />
          ) : insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((item, index) => {
                const message =
                  typeof item === "string"
                    ? item
                    : item?.message ||
                      item?.insight ||
                      item?.text ||
                      item?.content ||
                      item?.recommendation;

                if (!message) return null;

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200"
                  >
                    <div className="my-1 text-amber-500 shrink-0">
                      <Sparkles size={18} />
                    </div>
                    <p className="text-sm text-gray-700 leading-6">
                      {message}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-gray-50 text-gray-500 text-sm">
              No AI insights are available for the selected date.
            </div>
          )}
        </AnalyticsCard>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticalPage;
