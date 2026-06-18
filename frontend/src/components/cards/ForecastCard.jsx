const ForecastCard = ({
  generation,
  peakTime,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="font-semibold mb-3">
        Today's Forecast
      </h3>

      <p className="text-3xl font-bold text-amber-500">
        {generation}
      </p>

      <p className="mt-2 text-gray-600">
        Peak: {peakTime}
      </p>

    </div>
  );
};

export default ForecastCard;