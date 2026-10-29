
import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getInsights = async (params = {}) => {
  const response = await api.get("/insights", {
    params: buildDateParams(params),
  });

  console.log(
    "INSIGHTS FROM EXPRESS:",
    response.data
  );

  const insights = response.data?.insights;

  if (Array.isArray(insights)) {
    return insights;
  }

  if (typeof insights === "string" && insights.trim()) {
    return [insights];
  }

  return [];
};
