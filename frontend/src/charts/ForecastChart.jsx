import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ForecastChart = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h3 className="font-semibold mb-4">
        Hourly Forecast
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#f59e0b"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ForecastChart;