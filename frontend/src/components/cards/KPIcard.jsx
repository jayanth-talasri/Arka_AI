
import React from "react";
import { TrendingUp, Circle } from "lucide-react";

const KPICard = ({
  title,
  value,
  unit,
  icon: Icon = Circle,
  color = "from-amber-500 to-orange-500",
  trend = null,
  comparisonLabel = "compared with previous period",
}) => {
  const hasGrowth =
    trend !== null &&
    trend !== undefined &&
    Number.isFinite(Number(trend));

  const positive = hasGrowth && Number(trend) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
      />

      {/* KPI Content */}
      <div className="relative flex justify-between items-start">

        <div className="min-w-0">
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 break-words text-gray-900">
            {value}

            {unit && (
              <span className="text-base font-medium text-gray-500 ml-1">
                {unit}
              </span>
            )}
          </h2>
        </div>

        {/* Dynamic Lucide Icon */}
        <div
          className={`h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon
            className="text-white"
            size={28}
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Trend Information */}
      <div className="relative mt-5 flex items-center gap-2 flex-wrap">

        {hasGrowth ? (
          <>
            <TrendingUp
              size={18}
              className={
                positive
                  ? "text-green-600"
                  : "text-red-600 rotate-180"
              }
            />

            <span
              className={`font-medium ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {Number(trend) > 0 ? "+" : ""}
              {Number(trend).toFixed(1)}%
            </span>
          </>
        ) : (
          <span className="text-gray-400">
            — N/A
          </span>
        )}

        <span className="text-gray-400 text-sm">
          {comparisonLabel}
        </span>
      </div>

    </div>
  );
};

export default KPICard;
