const axios = require("axios");

const aiApi = axios.create({
    baseURL: process.env.AI_BACKEND_URL,
    timeout: 30000,
});

const getAI = async (url, params = {}) => {

    const response = await aiApi.get(url, {
        params
    });

    return response.data;
};

module.exports = {
    getAI
};