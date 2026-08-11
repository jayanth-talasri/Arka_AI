import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ForecastChart = ({ data = [] }) => {

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
            id="forecastAreaGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#f97316"
              stopOpacity={0.35}
            />

            <stop
              offset="100%"
              stopColor="#f97316"
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
        />

        <YAxis
          tickLine={false}
          axisLine={false}
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
            "Solar Output",
          ]}
        />

        <Area
          type="monotone"
          dataKey="radiation"
          stroke="#f97316"
          strokeWidth={3}
          fill="url(#forecastAreaGradient)"
        />

      </AreaChart>

    </ResponsiveContainer>
  );
};

export default ForecastChart;