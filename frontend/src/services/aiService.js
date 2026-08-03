import api from "./api";
import { API_ROUTES } from "../constants/apiRoutes";

export const getPrediction = async (params) => {

    const response = await api.get(API_ROUTES.PREDICT, {
        params
    });

    return response.data;
};

export const getWeather = async (params) => {

    const response = await api.get(API_ROUTES.WEATHER, {
        params
    });

    return response.data;
};

export const getForecast = async (params) => {

    const response = await api.get(API_ROUTES.FORECAST, {
        params
    });

    return response.data;
};

export const getAnalytics = async (params) => {

    const response = await api.get(API_ROUTES.ANALYTICS, {
        params
    });

    return response.data;
};

export const getSavings = async (params) => {

    const response = await api.get(API_ROUTES.SAVINGS, {
        params
    });

    return response.data;
};

export const getAppliances = async (params) => {

    const response = await api.get(API_ROUTES.APPLIANCES, {
        params
    });

    return response.data;
};

export const getDashboard = async (params) => {

    const response = await api.get(API_ROUTES.DASHBOARD, {
        params
    });

    return response.data;
};