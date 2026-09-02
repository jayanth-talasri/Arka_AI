import { useEffect, useState } from "react";
import {
  BarChart3,
  Zap,
  IndianRupee,
  Leaf,
  Gauge,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import { getAnalytics } from "../services/analyticsService";
import { getSolarScore } from "../services/solarScoreService";
import { getInsights } from "../services/insightsService";

import AnalyticsCard from "../components/cards/AnalyticsCard";
import KPICard from "../components/cards/KPICard";

import EnergyChart from "../charts/EnergyChart";
import SavingsChart from "../charts/SavingsChart";


const AnalyticalPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [solarScore, setSolarScore] = useState(null);
  const [insights, setInsights] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          analyticsData,
          scoreData,
          insightsData,
        ] = await Promise.all([
          getAnalytics(),
          getSolarScore(),
          getInsights(),
        ]);

        setAnalytics(analyticsData);
        setSolarScore(scoreData);
        setInsights(insightsData);

      } catch (err) {
        console.error(
          "Analytics loading error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          "Failed to load analytics data."
        );

      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);


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

        <div className="p-6">
          <ErrorMessage message={error} />
        </div>

      </DashboardLayout>
    );
  }


  if (!analytics) {
    return null;
  }


  const energyData = [
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
  ];


  const savingsData = [
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
  ];


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
            Monitor your solar generation,
            savings and environmental impact.
          </p>

        </div>


        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPICard
            title="Daily Energy"
            value={Number(
              analytics.daily_energy || 0
            ).toFixed(2)}
            unit="kWh"
            icon={Zap}
            color="from-amber-500 to-orange-500"
          />


          <KPICard
            title="Monthly Energy"
            value={Number(
              analytics.monthly_energy || 0
            ).toFixed(2)}
            unit="kWh"
            icon={BarChart3}
            color="from-blue-500 to-cyan-500"
          />


          <KPICard
            title="Monthly Savings"
            value={`₹${Number(
              analytics.monthly_saving || 0
            ).toFixed(2)}`}
            unit=""
            icon={IndianRupee}
            color="from-green-500 to-emerald-500"
          />


          <KPICard
            title="CO₂ Saved"
            value={Number(
              analytics.co2_saved || 0
            ).toFixed(2)}
            unit="kg"
            icon={Leaf}
            color="from-green-600 to-teal-500"
          />

        </div>


        {/* SOLAR SCORE */}

        {solarScore && (

          <AnalyticsCard title="Solar Performance Score">

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

                  <Gauge
                    size={38}
                    className="text-amber-500"
                  />

                </div>

                <p className="font-semibold mt-2">
                  Grade {solarScore.grade || "-"}
                </p>

                <p className="text-sm text-gray-500">
                  {solarScore.status || "Unknown"}
                </p>

              </div>

            </div>

          </AnalyticsCard>

        )}


        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <AnalyticsCard title="Energy Generation">

            <EnergyChart
              data={energyData}
            />

          </AnalyticsCard>


          <AnalyticsCard title="Savings Overview">

            <SavingsChart
              data={savingsData}
            />

          </AnalyticsCard>

        </div>


        {/* ENVIRONMENT */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <KPICard
            title="CO₂ Reduction"
            value={Number(
              analytics.co2_saved || 0
            ).toFixed(2)}
            unit="kg"
            icon={Leaf}
            color="from-green-500 to-emerald-500"
          />


          <KPICard
            title="Trees Equivalent"
            value={Number(
              analytics.trees_equivalent || 0
            ).toFixed(2)}
            unit="trees"
            icon={Leaf}
            color="from-green-600 to-lime-500"
          />


          <KPICard
            title="Panel Efficiency"
            value={Number(
              analytics.panel_efficiency || 0
            ).toFixed(2)}
            unit="%"
            icon={TrendingUp}
            color="from-purple-500 to-indigo-500"
          />

        </div>


        {/* INSIGHTS */}

        <AnalyticsCard title="AI Insights">

          <div className="space-y-3">

            {insights.length > 0 ? (

              insights.map((item, index) => (

                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50"
                >
                  {item}
                </div>

              ))

            ) : (

              <div className="p-4 rounded-xl bg-gray-50 text-gray-500">
                No insights available.
              </div>

            )}

          </div>

        </AnalyticsCard>

      </div>

    </DashboardLayout>
  );
};

export default AnalyticalPage;