import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getForecast = async (params = {}) => {
  const response = await api.get("/forecast", {
    params: buildDateParams(params),
  });

  return response.data?.forecast || {
    forecast: [],
  };
};