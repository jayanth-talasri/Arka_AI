import api from "./api";

export const getPrediction = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await api.get("/predict", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};