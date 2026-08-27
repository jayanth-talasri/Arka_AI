import api from "./api";

export const getCarbonImpact = async (
  latitude,
 longitude,
  start,
  end
) => {
  const res = await api.get("/carbon-impact", {
    params: {
      latitude,
      longitude,
      start,
      end,
    },
  });

  return res.data;
};