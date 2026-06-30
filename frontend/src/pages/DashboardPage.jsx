import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";

import DashboardLayout from "../layouts/DashboardLayout";

import KPIcard from "../components/cards/KPICard";
import ForecastChart from "../charts/ForecastChart";

import WeatherCard from "../components/cards/WeatherCard";
import SavingsCard from "../components/cards/SavingsCard";
import RecommendationCard from "../components/cards/RecommendationCard";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const data = await getAnalytics();

        console.log(data);

        setAnalytics(data);
        toast.success("Dashboard data loaded successfully!", {
         
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard data.");
        toast.error(error.response?.data?.message || "Failed to load dashboard data.", {
          
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader text="Loading Dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Welcome Jayanth
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <KPIcard
          title="Today's Generation"
          value={`${analytics.summary.todayGeneration} kWh`}
        />

        <KPIcard
          title="Peak Time"
          value="12 PM - 2 PM"
        />

        <KPIcard
          title="Savings"
          value={`₹${analytics.summary.savings}`}
        />

        <KPIcard
          title="Weather"
          value="Sunny"
        />

      </div>

      <ForecastChart />

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <WeatherCard
          temperature={34}
          condition="Sunny"
        />

        <SavingsCard
          amount={analytics.summary.savings}
        />

      </div>

      <div className="bg-white rounded-xl shadow p-5 mt-6">

        <h2 className="text-xl font-bold mb-4">
          AI Recommendations
        </h2>

        <RecommendationCard
          appliance="Washing Machine"
          time="11:30 AM"
        />

        <RecommendationCard
          appliance="Water Heater"
          time="12:15 PM"
        />

        <RecommendationCard
          appliance="EV Charging"
          time="1:00 PM"
        />

      </div>

    </DashboardLayout>
  );
};

export default DashboardPage;