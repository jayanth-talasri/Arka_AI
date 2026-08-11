import aiApi from "./aiApi";

export const getInsights = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/insights", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};