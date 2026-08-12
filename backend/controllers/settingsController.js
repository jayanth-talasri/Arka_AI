const pool = require("../config/db");

const getSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT *
            FROM user_settings
            WHERE user_id = $1
            `,
            [userId]
        );

        res.json({
            success: true,
            settings: result.rows[0] || null
        });

    } catch (error) {
        console.error("Get settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch settings"
        });
    }
};


const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            latitude,
            longitude,
            panel_capacity,
            electricity_rate
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO user_settings
            (
                user_id,
                latitude,
                longitude,
                panel_capacity,
                electricity_rate
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id)
            DO UPDATE SET
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                panel_capacity = EXCLUDED.panel_capacity,
                electricity_rate = EXCLUDED.electricity_rate
            RETURNING *
            `,
            [
                userId,
                latitude,
                longitude,
                panel_capacity,
                electricity_rate
            ]
        );

        res.json({
            success: true,
            message: "Settings updated successfully",
            settings: result.rows[0]
        });

    } catch (error) {
        console.error("Update settings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update settings"
        });
    }
};


module.exports = {
    getSettings,
    updateSettings
};