const axios = require("axios");

const {
    getUserSettings
} = require("../services/userSettingsService");


const getForecast = async (req, res) => {

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

                message:
                    "start and end are required"

            });

        }


        // ==========================================
        // GET USER SETTINGS
        // ==========================================

        const settings =
            await getUserSettings(userId);


        if (!settings) {

            return res.status(404).json({

                success: false,

                message:
                    "User settings not found. Please configure settings first."

            });

        }


        // ==========================================
        // LOG
        // ==========================================

        console.log(
            "========== FORECAST =========="
        );

        console.log(
            "User:",
            userId
        );

        console.log(
            "Location:",
            settings.latitude,
            settings.longitude
        );

        console.log(
            "Start:",
            start
        );

        console.log(
            "End:",
            end
        );

        console.log(
            "================================"
        );


        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const response = await axios.get(

            `${process.env.AI_BACKEND_URL}/forecast`,

            {

                params: {

                    latitude:
                        settings.latitude,

                    longitude:
                        settings.longitude,

                    start,

                    end

                },

                headers: {

                    "X-AI-API-Key":
                        process.env.AI_API_KEY

                },

                timeout: 120000

            }

        );


        console.log(
            "AI Forecast response received"
        );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            user_id:
                userId,

            settings: {

                location:
                    settings.location,

                latitude:
                    settings.latitude,

                longitude:
                    settings.longitude,

                solar_capacity:
                    settings.solar_capacity,

                electricity_rate:
                    settings.electricity_rate

            },

            forecast:
                response.data

        });


    } catch (error) {


        console.error(
            "========== FORECAST ERROR =========="
        );


        if (error.response) {

            return res.status(
                error.response.status
            ).json({

                success: false,

                message:
                    "AI backend forecast request failed",

                error:
                    error.response.data

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate forecast",

            error:
                error.message

        });

    }

};


module.exports = {

    getForecast

};