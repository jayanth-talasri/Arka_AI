import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "8AM", energy: 2 },
  { time: "10AM", energy: 5 },
  { time: "12PM", energy: 8 },
  { time: "2PM", energy: 7 },
  { time: "4PM", energy: 4 },
];

const ForecastChart = () => {
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
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default ForecastChart;