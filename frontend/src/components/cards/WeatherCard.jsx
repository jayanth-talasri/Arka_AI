const WeatherCard = ({ weather = {}, selectedDate, range = "daily" }) => {
  const getValidValue = (value) => {
    if (value === null || value === undefined || value === "" || Number(value) === -999 || !Number.isFinite(Number(value))) return null;
    return Number(value);
  };
  const temperature = getValidValue(weather.temperature);
  const humidity = getValidValue(weather.humidity);
  const wind = getValidValue(weather.wind_speed);
  const condition = weather.condition || "N/A";
  const display = (value) => value === null ? "N/A" : value.toFixed(1);
  const dateLabel = selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Selected period";
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Weather</h2>
          <p className="text-sm text-gray-500 mt-1">{range === "daily" ? dateLabel : `Selected ${range} period`}</p>
          <p className="text-xs text-gray-400 mt-1">Source: {weather.source || "Unavailable"}</p>
        </div>
        <span className="text-3xl">☁️</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-sky-50 p-4">
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{display(temperature)}<span className="text-sm font-normal">{temperature === null ? "" : " °C"}</span></p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">Humidity</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{display(humidity)}<span className="text-sm font-normal">{humidity === null ? "" : " %"}</span></p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-4">
          <p className="text-sm text-gray-500">Wind Speed</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{display(wind)}<span className="text-sm font-normal">{wind === null ? "" : " m/s"}</span></p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-gray-500">Condition</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{condition}</p>
        </div>
      </div>
    </div>
  );
};
export default WeatherCard;