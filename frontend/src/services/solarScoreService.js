import aiApi from "./aiApi";

export const getSolarScore = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/solar-score", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};