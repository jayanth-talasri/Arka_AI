const pool = require("../config/db");


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
        `,
        [userId]
    );


    if (result.rows.length === 0) {

        return null;

    }


    const settings = result.rows[0];


    return {

        location: settings.location,

        latitude: Number(settings.latitude),

        longitude: Number(settings.longitude),

        solar_capacity: Number(settings.solar_capacity),

        electricity_rate: Number(settings.electricity_rate),

        appliance_info: settings.appliance_info

    };

};


module.exports = {

    getUserSettings

};