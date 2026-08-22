const axios = require("axios");
const pool = require("../config/db");

const getForecast = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            start,
            end
        } = req.query;

        if (!start || !end) {

            return res.status(400).json({
                success: false,
                message: "start and end are required"
            });

        }

        // ==========================================
        // GET USER SETTINGS
        // ==========================================

        const settingsResult = await pool.query(
            `
            SELECT
                latitude,
                longitude,
                solar_capacity,
                electricity_rate
            FROM public.user_settings
            WHERE user_id = $1
            `,
            [userId]
        );

        if (settingsResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User settings not found. Please configure settings first."
            });

        }

        const settings = settingsResult.rows[0];

        const latitude = Number(settings.latitude);
        const longitude = Number(settings.longitude);

        console.log("========== FORECAST ==========");
        console.log("User:", userId);
        console.log("Location:", latitude, longitude);
        console.log("Start:", start);
        console.log("End:", end);

        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const aiBackendUrl = process.env.AI_BACKEND_URL;

        const response = await axios.get(
            `${aiBackendUrl}/forecast`,
            {
                params: {
                    latitude,
                    longitude,
                    start,
                    end
                },

                headers: {
                    "x-api-key": process.env.AI_API_KEY
                },
                timeout: 120000
            }
        );

        const prediction = response.data;

        console.log("AI Forecast response received");

        return res.status(200).json({
            success: true,

            user_id: userId,

            settings: {
                latitude,
                longitude,
                solar_capacity: settings.solar_capacity,
                electricity_rate: settings.electricity_rate
            },

            forecast: prediction
        });

    } catch (error) {

        console.error("========== FORECAST ERROR ==========");

        if (error.response) {

            return res.status(error.response.status).json({
                success: false,
                message: "AI backend forecast request failed",
                error: error.response.data
            });

        }

        return res.status(500).json({
            success: false,
            message: "Failed to generate forecast",
            error: error.message
        });
    }
};


module.exports = {
    getForecast
};