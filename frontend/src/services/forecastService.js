
import api from "./api";
import { buildDateParams } from "./apiHelper";
export const getForecast = async (params = {}) => {
  const response = await api.get("/forecast", {
    params: buildDateParams(params)
  });
  const data = response.data?.forecast?.forecast ?? response.data?.forecast ?? response.data;
  if (Array.isArray(data)) return data;
  console.error("Unexpected forecast response structure:", response.data);
  return [];
};
