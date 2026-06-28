import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const HistoricalChart = ({ data = [] }) => {
  return (
    <div className="h-72">
      <h2 className="text-xl font-semibold mb-4">
        Monthly Generation
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="energy"
            fill="#f59e0b"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;