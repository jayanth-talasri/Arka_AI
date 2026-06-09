const SavingsCard = ({ amount }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="font-semibold">
        Potential Savings
      </h3>

      <h2 className="text-3xl font-bold text-green-600 mt-3">
        ₹{amount}
      </h2>

    </div>
  );
};

export default SavingsCard;