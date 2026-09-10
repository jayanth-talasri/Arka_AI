const axios = require("axios");
const pool = require("../config/db");

const getRecommendations = async (req, res) => {

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

        if (settingsResult.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User settings not found"
            });

        }

        const settings =
            settingsResult.rows[0];

        // ==========================================
        // VALIDATE COORDINATES
        // ==========================================

        if (
            settings.latitude === null ||
            settings.latitude === undefined ||
            settings.longitude === null ||
            settings.longitude === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude are required in user settings"
            });

        }

        // ==========================================
        // AI BACKEND
        // ==========================================

        const aiUrl =
            `${process.env.AI_BACKEND_URL}/recommendation`;

        console.log(
            "\n========== RECOMMENDATION PROXY =========="
        );

        console.log("User ID:", userId);
        console.log("AI URL:", aiUrl);
        console.log("Latitude:", settings.latitude);
        console.log("Longitude:", settings.longitude);
        console.log("Start:", start);
        console.log("End:", end);

        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const response = await axios.get(
            aiUrl,
            {

                params: {
                    latitude:
                        Number(settings.latitude),

                    longitude:
                        Number(settings.longitude),

                    start,
                    end
                },

                headers: {
                    "x-ai-api-key":
                        process.env.AI_API_KEY
                },

                timeout: 120000
            }
        );

        console.log(
            "AI Recommendation Response:",
            response.data
        );

        // ==========================================
        // SUCCESS
        // ==========================================

        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {

                location:
                    settings.location,

                latitude:
                    Number(settings.latitude),

                longitude:
                    Number(settings.longitude),

                solar_capacity:
                    Number(settings.solar_capacity),

                electricity_rate:
                    Number(settings.electricity_rate),

                appliance_info:
                    settings.appliance_info
            },

            recommendations:
                response.data
        });

    } catch (error) {

        console.error(
            "\n========== RECOMMENDATION ERROR =========="
        );

        // ==========================================
        // AI BACKEND ERROR
        // ==========================================

        if (error.response) {

            console.error(
                "AI Backend Status:",
                error.response.status
            );

            console.error(
                "AI Backend Response:",
                error.response.data
            );

            return res.status(
                error.response.status
            ).json({

                success: false,

                message:
                    "AI recommendation request failed",

                error:
                    error.response.data
            });
        }

        // ==========================================
        // NODE / NETWORK ERROR
        // ==========================================

        console.error(
            "Unhandled Error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch recommendations",

            error:
                error.message
        });
    }
};

module.exports = {
    getRecommendations
};