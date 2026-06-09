const WeatherCard = ({
  temperature,
  condition,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="font-semibold mb-3">
        Weather
      </h3>

      <h2 className="text-3xl font-bold">
        {temperature}°C
      </h2>

      <p className="text-gray-500">
        {condition}
      </p>

    </div>
  );
};

export default WeatherCard;