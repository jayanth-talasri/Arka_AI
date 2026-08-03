import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";

import HistoricalChart from "../charts/HistoricalChart";
import EnergyChart from "../charts/EnergyChart";
import SavingsChart from "../charts/SavingsChart";

import DashboardLayout from "../layouts/DashboardLayout";
import KPIcard from "../components/cards/KPICard";

const AnalyticalPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(
          17.385,
          78.487,
          "20240101",
          "20240107"
        );
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnalytics();
  }, []);

const [loading, setLoading] = useState(true);
if (loading) {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold">
        Loading Analytics...
      </h1>
    </DashboardLayout>
  );
}
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <KPIcard
          title="Today's Generation"
          value={`${analytics.summary.todayGeneration} kWh`}
        />

        <KPIcard
          title="Monthly Generation"
          value={`${analytics.summary.monthlyGeneration} kWh`}
        />

        <KPIcard
          title="Total Savings"
          value={`₹${analytics.summary.savings}`}
        />

        <KPIcard
          title="Carbon Saved"
          value={`${analytics.summary.carbonSaved} kg`}
        />
      </div>

      <div className="bg-white mt-8 rounded-xl shadow p-6 h-80">
        <HistoricalChart data={analytics.historical} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6 h-80">
          <EnergyChart data={analytics.dailyForecast} />
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-80">
          <SavingsChart data={analytics.summary.savings} />
        </div>

      </div>

    </DashboardLayout>
  );
};

export default AnalyticalPage;