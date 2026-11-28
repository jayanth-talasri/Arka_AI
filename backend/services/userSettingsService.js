
const pool = require("../config/db");

const parseAppliances = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) return parsed;
    } catch (_) {
        // Existing comma-separated records are supported.
    }

    return String(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
};

const toNullableNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

const getUserSettings = async (userId) => {
    const result = await pool.query(
        `
        SELECT
            location,
            latitude,
            longitude,
            solar_capacity,
            electricity_rate,
            appliance_info
        FROM public.user_settings
        WHERE user_id = $1
        LIMIT 1
        `,
        [userId]
    );

    if (!result.rows.length) return null;

    const settings = result.rows[0];

    return {
        location: settings.location,
        latitude: toNullableNumber(settings.latitude),
        longitude: toNullableNumber(settings.longitude),
        solar_capacity: toNullableNumber(settings.solar_capacity),
        electricity_rate: toNullableNumber(settings.electricity_rate),
        appliance_info: settings.appliance_info,
        appliances: parseAppliances(settings.appliance_info)
    };
};

const validateUserSettings = (settings) => {
    if (!settings) {
        return "User settings not found. Please configure settings first.";
    }

    if (
        settings.latitude === null ||
        settings.longitude === null
    ) {
        return "Valid location coordinates are required.";
    }

    if (
        settings.latitude < -90 ||
        settings.latitude > 90 ||
        settings.longitude < -180 ||
        settings.longitude > 180
    ) {
        return "Invalid latitude or longitude.";
    }

    if (
        settings.solar_capacity === null ||
        settings.electricity_rate === null
    ) {
        return "Solar capacity and electricity tariff must be configured.";
    }

    return null;
};

module.exports = {
    getUserSettings,
    parseAppliances,
    validateUserSettings
};