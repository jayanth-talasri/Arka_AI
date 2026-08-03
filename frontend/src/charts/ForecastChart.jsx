import {
  LineChart,
  Line,
 XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ForecastChart = ({ prediction }) => {
  
  const data = [
    {
      day: "Today",
      radiation: prediction?.predicted_radiation || 0,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <h3 className="text-lg font-semibold mb-4">
        Solar Forecast
      </h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="radiation"
            stroke="#f59e0b"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default ForecastChart;