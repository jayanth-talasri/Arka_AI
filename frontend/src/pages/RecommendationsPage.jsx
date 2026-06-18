import DashboardLayout from "../layouts/DashboardLayout";
import RecommendationCard from "../components/cards/RecommendationCard";

const RecommendationsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Smart Recommendations
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <RecommendationCard
            appliance="Washing Machine"
            time="11:30 AM"
            saving="₹8"
          />

          <RecommendationCard
            appliance="Water Heater"
            time="12:15 PM"
            saving="₹12"
          />

          <RecommendationCard
            appliance="Charge EV"
            time="1:00 PM"
            saving="₹25"
          />

          <RecommendationCard
            appliance="Water Pump"
            time="12:45 PM"
            saving="₹10"
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default RecommendationsPage;