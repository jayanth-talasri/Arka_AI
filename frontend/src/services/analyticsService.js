import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getAnalytics = async (params = {}) => {
  const response = await api.get("/analytics", {
    params: buildDateParams(params),
  });

  return response.data?.analytics || {};
};