import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#6366f1",
];

const SavingsChart = ({ data = [] }) => {

  const validData = data.filter(
    (item) => Number(item.value) > 0
  );

  if (!validData.length) {
    return (
      <div className="
        h-full
        flex
        items-center
        justify-center
        text-slate-400
      ">
        No savings data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={validData}
          dataKey="value"
          nameKey="name"
          innerRadius={75}
          outerRadius={110}
          paddingAngle={4}
          stroke="none"
        >

          {validData.map((entry, index) => (
            <Cell
              key={`${entry.name}-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}

        </Pie>

        <Tooltip
          formatter={(value) =>
            `₹${Number(value).toFixed(2)}`
          }
          contentStyle={{
            borderRadius: "14px",
            border: "none",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.10)",
          }}
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
        />

      </PieChart>

    </ResponsiveContainer>
  );
};

export default SavingsChart;