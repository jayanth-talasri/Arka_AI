import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#f59e0b", "#0ea5e9"];

const SavingsChart = ({ savings = 0 }) => {
  const data = [
    {
      name: "Savings",
      value: savings,
    },
    {
      name: "Remaining",
      value: 100,
    },
  ];

  return (
    <div className="h-72">
      <h2 className="text-xl font-semibold mb-4">
        Savings
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={90}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;