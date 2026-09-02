import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getInsights = async (params = {}) => {
  const response = await api.get("/insights", {
    params: buildDateParams(params),
  });

  return response.data?.insights || {};
};