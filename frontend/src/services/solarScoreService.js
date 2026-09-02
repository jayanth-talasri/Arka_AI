import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getSolarScore = async (params = {}) => {
  const response = await api.get("/solar-score", {
    params: buildDateParams(params),
  });

  return response.data?.solar_score || {};
};