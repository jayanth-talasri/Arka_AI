import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const WeeklyForecastChart = ({ data = [] }) => {

  if (!data.length) {
    return (
      <div className="
        h-full
        flex
        items-center
        justify-center
        text-slate-400
      ">
        No forecast data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">

      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -15,
          bottom: 0,
        }}
      >

        <defs>

          <linearGradient
            id="solarForecastGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#f59e0b"
              stopOpacity={0.45}
            />

            <stop
              offset="100%"
              stopColor="#f59e0b"
              stopOpacity={0.02}
            />

          </linearGradient>

        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{
            fontSize: 12,
          }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{
            fontSize: 12,
          }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "14px",
            border: "none",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.10)",
          }}
          formatter={(value) => [
            `${Number(value).toFixed(2)} kWh/m²/day`,
            "Radiation",
          ]}
        />

        <Area
          type="monotone"
          dataKey="radiation"
          stroke="#f59e0b"
          strokeWidth={3}
          fill="url(#solarForecastGradient)"
          activeDot={{
            r: 6,
          }}
        />

      </AreaChart>

    </ResponsiveContainer>
  );
};

export default WeeklyForecastChart;