const AccuracyCard = () => {
  return (
    <div className="bg-white shadow rounded-xl p-5">

      <h3 className="font-semibold mb-3">
        Prediction Accuracy
      </h3>

      <h2 className="text-4xl font-bold text-green-600">
        96%
      </h2>

      <p className="text-gray-500 mt-2">
        Based on previous forecast performance.
      </p>

    </div>
  );
};

export default AccuracyCard;