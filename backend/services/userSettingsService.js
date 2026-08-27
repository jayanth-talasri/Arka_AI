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


    return result.rows[0];

};


module.exports = {
    getUserSettings
};