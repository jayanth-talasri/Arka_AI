const axios = require("axios");
const pool = require("../config/db");

const getWeather = async (req, res) => {
    try {

        const userId = req.user.id;

        const {
            start,
            end
        } = req.query;

        // ==========================================
        // VALIDATE DATES
        // ==========================================

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
                longitude
            FROM public.user_settings
            WHERE user_id = $1
            `,
            [userId]
        );

        if (settingsResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User settings not found"
            });
        }

        const settings = settingsResult.rows[0];

        const latitude = Number(settings.latitude);
        const longitude = Number(settings.longitude);

        // ==========================================
        // AI BACKEND CONFIG
        // ==========================================

        const aiBackendUrl = process.env.AI_BACKEND_URL;
        const aiApiKey = process.env.AI_API_KEY;

        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const response = await axios.get(
            `${aiBackendUrl}/weather`,
            {
                params: {
                    latitude,
                    longitude,
                    start,
                    end
                },

                headers: {
                    "X-AI-API-Key": aiApiKey
                },

                timeout: 120000
            }
        );

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,

            user_id: userId,

            settings: {
                latitude,
                longitude
            },

            weather: response.data
        });

    } catch (error) {

        console.error(
            "========== WEATHER ERROR =========="
        );

        if (error.response) {

            console.error(
                error.response.data
            );

            return res.status(
                error.response.status
            ).json({
                success: false,
                message:
                    "AI backend weather request failed",
                error: error.response.data
            });
        }

        console.error(error.message);

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch weather",
            error: error.message
        });
    }
};

module.exports = {
    getWeather
};