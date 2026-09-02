import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getCarbonImpact = async (params = {}) => {
  const response = await api.get("/carbon", {
    params: buildDateParams(params),
  });

  return response.data?.carbon_impact || {};
};