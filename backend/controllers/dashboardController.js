const axios = require("axios");
const pool = require("../config/db");

const getDashboard = async (req, res) => {
    try {

        // ==========================================
        // 1. GET USER FROM JWT
        // ==========================================

        const userId = req.user.id;

        const { start, end } = req.query;

        if (!start || !end) {
            return res.status(400).json({
                success: false,
                message: "start and end are required"
            });
        }

        console.log("========== DASHBOARD ==========");
        console.log("User:", userId);
        console.log("Start:", start);
        console.log("End:", end);


        // ==========================================
        // 2. GET USER SETTINGS
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


        // ==========================================
        // 3. CALL FASTAPI
        // ==========================================

        const aiBackendUrl = process.env.AI_BACKEND_URL;

        if (!aiBackendUrl) {

            return res.status(500).json({
                success: false,
                message: "AI backend URL is not configured"
            });

        }

        if (!process.env.AI_API_KEY) {

            return res.status(500).json({
                success: false,
                message: "AI API key is not configured"
            });

        }


        console.log("AI Backend:", `${aiBackendUrl}/dashboard`);
        console.log("AI Key configured:", !!process.env.AI_API_KEY);


        const response = await axios.get(
            `${aiBackendUrl}/dashboard`,
            {
                params: {
                    latitude,
                    longitude,
                    start,
                    end
                },

                headers: {
                    "X-AI-API-Key": process.env.AI_API_KEY
                },

                timeout: 120000
            }
        );


        // ==========================================
        // 4. RETURN AI RESULT TO FRONTEND
        // ==========================================

        console.log("AI Dashboard response received");

        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {
                latitude,
                longitude,
                solar_capacity: settings.solar_capacity,
                electricity_rate: settings.electricity_rate
            },

            dashboard: response.data

        });


    } catch (error) {

        console.error("========== DASHBOARD ERROR ==========");

        if (error.response) {

            console.error(
                "AI Backend status:",
                error.response.status
            );

            console.error(
                "AI Backend response:",
                error.response.data
            );

            return res.status(error.response.status).json({

                success: false,

                message: "AI backend dashboard request failed",

                error: error.response.data

            });

        }


        console.error("Error:", error.message);

        return res.status(500).json({

            success: false,

            message: "Failed to generate dashboard",

            error: error.message

        });

    }
};


module.exports = {
    getDashboard
};