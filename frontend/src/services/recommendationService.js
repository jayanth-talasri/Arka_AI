import api from "./api";
import { buildDateParams } from "./apiHelper";

export const getRecommendations = async (params = {}) => {
  const response = await api.get("/recommendations", {
    params: buildDateParams(params),
  });

  return (
    response.data?.recommendation ||
    response.data?.recommendations ||
    response.data
  );
};