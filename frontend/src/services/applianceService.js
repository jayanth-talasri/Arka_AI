import aiApi from "./aiApi";

export const getAppliances = async (
    latitude,
    longitude,
    start,
    end
) => {

    const response = await aiApi.get("/appliances", {
        params: {
            latitude,
            longitude,
            start,
            end
        }
    });

    return response.data;
};