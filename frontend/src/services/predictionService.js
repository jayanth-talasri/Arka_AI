import aiApi from "./aiApi";

export const getPrediction = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/predict", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};