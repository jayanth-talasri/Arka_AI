const axios = require("axios");
const pool = require("../config/db");

const getRecommendations = async (req, res) => {

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

        const settings = settingsResult.rows[0];

        // ==========================================
        // CALL AI RECOMMENDATION API
        // ==========================================

        const response = await axios.get(
            `${process.env.AI_BACKEND_URL}/recommendation`,
            {
                params: {
                    latitude: Number(settings.latitude),
                    longitude: Number(settings.longitude),
                    start,
                    end
                },
                 headers: {
                    "x-api-key": process.env.AI_API_KEY
                },
                timeout: 120000
            }
        );
          

        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {
                location: settings.location,
                solar_capacity: settings.solar_capacity,
                electricity_rate: settings.electricity_rate,
                appliance_info: settings.appliance_info
            },

            recommendations: response.data

        });

    } catch (error) {

        console.error("RECOMMENDATION ERROR:", error);

        if (error.response) {

            return res.status(error.response.status).json({
                success: false,
                message: "AI recommendation request failed",
                error: error.response.data
            });

        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch recommendations",
            error: error.message
        });
    }
};


module.exports = {
    getRecommendations
};