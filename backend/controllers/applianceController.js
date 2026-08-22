const axios = require("axios");
const pool = require("../config/db");

const getAppliances = async (req, res) => {

    try {

        const userId = req.user.id;

        // ==========================================
        // GET USER SETTINGS
        // ==========================================

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

            return res.status(404).json({
                success: false,
                message: "User settings not found"
            });

        }

        const settings = result.rows[0];

        // ==========================================
        // VALIDATE LOCATION
        // ==========================================

        if (
            settings.latitude === null ||
            settings.longitude === null
        ) {

            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required in user settings"
            });

        }

        console.log("========== APPLIANCE PROXY ==========");
        console.log("User ID:", userId);
        console.log("Location:", settings.location);
        console.log("Latitude:", settings.latitude);
        console.log("Longitude:", settings.longitude);
        console.log("Appliances:", settings.appliance_info);

        // ==========================================
        // AI BACKEND
        // ==========================================

        const aiUrl =
            `${process.env.AI_BACKEND_URL}/appliances`;

        console.log("AI Appliance URL:", aiUrl);

        const response = await axios.get(
            aiUrl,
            {
                params: {

                    latitude: settings.latitude,
                    longitude: settings.longitude,

                    // Use the same period your AI endpoint expects
                    start: "20240101",
                    end: "20240107"
                },

                headers: {
                    "X-AI-Token":
                        process.env.AI_INTERNAL_TOKEN
                },

                timeout: 120000
            }
        );

        console.log("AI Appliance response received");

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {
                location: settings.location,
                latitude: settings.latitude,
                longitude: settings.longitude,
                solar_capacity: settings.solar_capacity,
                electricity_rate: settings.electricity_rate,
                appliance_info: settings.appliance_info
            },

            appliances: response.data

        });

    } catch (error) {

        console.error("========== APPLIANCE ERROR ==========");

        if (error.response) {

            console.error(
                "AI Backend Status:",
                error.response.status
            );

            console.error(
                "AI Backend Response:",
                error.response.data
            );

            return res.status(error.response.status).json({

                success: false,

                message:
                    "AI appliance request failed",

                error:
                    error.response.data

            });

        }

        console.error(
            "Unhandled error:",
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch appliance recommendations"

        });
    }
};

module.exports = {
    getAppliances
};