import aiApi from "./aiApi";

export const getCarbonImpact = async (
  latitude,
 longitude,
  start,
  end
) => {
  const res = await aiApi.get("/carbon-impact", {
    params: {
      latitude,
      longitude,
      start,
      end,
    },
  });

  return res.data;
};