import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getWeather = async (params = {}) => {
  const response = await api.get("/weather", {
    params: buildDateParams(params),
  });

  return response.data?.weather || {};
};