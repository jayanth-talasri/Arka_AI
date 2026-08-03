import aiApi from "./aiApi";

export const getSavings = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/savings", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};