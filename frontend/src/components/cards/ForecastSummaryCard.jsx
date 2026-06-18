const ForecastSummaryCard = ({
  generation,
  peakTime,
  savings,
}) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Tomorrow's Forecast
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <p className="text-gray-500">
            Generation
          </p>
          <h3 className="text-2xl font-bold">
            {generation}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">
            Peak Time
          </p>
          <h3 className="text-2xl font-bold">
            {peakTime}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">
            Savings
          </p>
          <h3 className="text-2xl font-bold text-green-600">
            ₹{savings}
          </h3>
        </div>

      </div>

    </div>
  );
};

export default ForecastSummaryCard;