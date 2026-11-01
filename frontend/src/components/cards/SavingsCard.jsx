const SavingsCard = ({ amount, range = "daily", status = "estimated" }) => {
  const labels = {
    daily: "Daily Savings",
    weekly: "Weekly Savings",
    monthly: "Monthly Savings",
    yearly: "Yearly Savings"
  };
  const validAmount = amount !== null && amount !== undefined && Number.isFinite(Number(amount));
  const statusLabels = {
    actual: "Based on historical data",
    estimated: "Estimated savings",
    mixed: "Based on actual and estimated data",
    unavailable: "Data unavailable"
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Solar Savings</h2>
      <div className="rounded-xl bg-amber-50 p-5">
        <p className="text-sm text-gray-500">{labels[range] || "Selected Period Savings"}</p>
        <p className="text-3xl font-bold text-amber-600 mt-2">
          {validAmount ? `₹${Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A"}
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-4">{statusLabels[status] || statusLabels.estimated}</p>
    </div>
  );
};
export default SavingsCard;