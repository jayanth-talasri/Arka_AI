import api from "./api";


export const getSavings = async () => {

    const response =
        await api.get("/savings");

    return response.data;

};