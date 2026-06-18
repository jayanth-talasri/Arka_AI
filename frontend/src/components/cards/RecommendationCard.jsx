const RecommendationCard = ({
  appliance,
  time,
  saving
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        {appliance}
      </h2>

      <p className="text-gray-600">
        Best Time
      </p>

      <h3 className="text-2xl font-bold text-amber-500">
        {time}
      </h3>

      <p className="mt-4 text-green-600 font-semibold">
        Estimated Saving: {saving}
      </p>

    </div>
  );
};

export default RecommendationCard;