import DashboardLayout from "../layouts/DashboardLayout";
import KPIcard from "../components/cards/KPIcard";

const AnalyticalPage = () => {
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <KPIcard
          title="Total Generation"
          value="127 kWh"
        />

        <KPIcard
          title="Total Savings"
          value="₹412"
        />

        <KPIcard
          title="Average Production"
          value="18.2 kWh"
        />

      </div>

      <div className="bg-white mt-8 rounded-xl shadow p-6 h-80">
        Historical Chart
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6 h-80">
          Energy Chart
        </div>

        <div className="bg-white rounded-xl shadow p-6 h-80">
          Savings Chart
        </div>

      </div>

    </DashboardLayout>
  );
};

export default AnalyticalPage;