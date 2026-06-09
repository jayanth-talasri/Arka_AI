const RecommendationCard = ({
  appliance,
  time,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-3">

      <h4 className="font-semibold">
        {appliance}
      </h4>

      <p className="text-gray-600">
        Recommended Time: {time}
      </p>

    </div>
  );
};

export default RecommendationCard;