import DashboardLayout from "../layouts/DashboardLayout";

import ForecastSummaryCard from "../components/cards/ForecastSummaryCard";
import AccuracyCard from "../components/cards/AccuracyCard";
import WeatherImpactCard from "../components/cards/WeatherImpactCard";

import ForecastChart from "../charts/ForecastChart";
import DailyForecastChart from "../charts/DailyForecastChart";
import WeeklyForecastChart from "../charts/WeeklyForecastChart";

const ForecastPage = () => {
  return (
    <DashboardLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Solar Forecasting
        </h1>

        <ForecastSummaryCard
          generation="21.4 kWh"
          peakTime="12 PM - 2 PM"
          savings="58"
        />

        <div className="mt-6">
          <ForecastChart />
        </div>

        <div className="mt-6">
          <DailyForecastChart />
        </div>

        <div className="mt-6">
          <WeeklyForecastChart />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <AccuracyCard />

          <WeatherImpactCard />

        </div>

      </div>

    </DashboardLayout>
  );
};

export default ForecastPage;