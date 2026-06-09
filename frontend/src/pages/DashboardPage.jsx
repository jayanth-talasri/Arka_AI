import DashboardLayout from "../layouts/DashboardLayout";

import KPIcard from "../components/cards/KPIcard";
import ForecastChart from "../charts/ForecastChart";

import WeatherCard from "../components/cards/WeatherCard";
import SavingsCard from "../components/cards/SavingsCard";
import RecommendationCard from "../components/cards/RecommendationCard";

const DashboardPage = () => {
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Welcome Jayanth
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">

        <KPIcard
          title="Today's Generation"
          value="18.2 kWh"
        />

        <KPIcard
          title="Peak Time"
          value="12 PM - 2 PM"
        />

        <KPIcard
          title="Savings"
          value="₹42"
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

        <SavingsCard amount={42} />

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