import aiApi from "./aiApi";

export const getForecast = async (
  latitude,
  longitude,
  start,
  end
) => {

  const response = await aiApi.get("/forecast", {
    params: {
      latitude,
      longitude,
      start,
      end,
    },
  });

  return response.data;
};