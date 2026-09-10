import api from "./api";

export const getAppliances = async (start, end) => {
    const response = await api.get("/appliances", {
        params: {
            start,
            end,
        },
    });

    return response.data;
};