const KPICard = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div>
          {icon}
        </div>

      </div>

    </div>
  );
};

export default KPICard;