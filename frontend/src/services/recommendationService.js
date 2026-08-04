import aiApi from "./aiApi";

export const getRecommendations = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/recommendation", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};