
import api from "./api";

export const getHistory = async (dates) => {
  const response = await api.get("/history", {
    params: {
      start: dates.start,
      end: dates.end,
    },
  });

  console.log("HISTORY API RAW RESPONSE:", response.data);
  console.log("HISTORY RESPONSE KEYS:", Object.keys(response.data || {}));

  return response.data;
};
