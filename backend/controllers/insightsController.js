const axios = require("axios");

const {
    getUserSettings
} = require("../services/userSettingsService");


const getInsights = async (req, res) => {

    try {

        // ==========================================
        // AUTHENTICATED USER
        // ==========================================

        const userId = req.user.id;


        // ==========================================
        // GET DATE PARAMETERS
        // ==========================================

        const {

            start,
            end

        } = req.query;


        if (!start || !end) {

            return res.status(400).json({

                success: false,

                message:
                    "start and end query parameters are required"

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


        const latitude =
            Number(settings.latitude);

        const longitude =
            Number(settings.longitude);


        // ==========================================
        // AI BACKEND CONFIGURATION
        // ==========================================

        const aiBackendUrl =
            process.env.AI_BACKEND_URL;


        // ==========================================
        // DEBUG LOG
        // ==========================================

        console.log(
            "========== INSIGHTS =========="
        );

        console.log(
            "User:",
            userId
        );

        console.log(
            "Latitude:",
            latitude
        );

        console.log(
            "Longitude:",
            longitude
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
            "AI Backend:",
            `${aiBackendUrl}/insights`
        );

        console.log(
            "================================"
        );


        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const response =
            await axios.get(

                `${aiBackendUrl}/insights`,

                {

                    params: {

                        latitude,

                        longitude,

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


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {

                location:
                    settings.location,

                latitude,

                longitude,

                solar_capacity:
                    settings.solar_capacity,

                electricity_rate:
                    settings.electricity_rate

            },

            insights:
                response.data

        });


    } catch (error) {

        console.error(
            "========== INSIGHTS ERROR =========="
        );


        if (error.response) {

            console.error(
                "AI Backend Error:",
                error.response.data
            );


            return res
                .status(error.response.status)
                .json({

                    success: false,

                    message:
                        "AI backend insights request failed",

                    error:
                        error.response.data

                });

        }


        console.error(
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch insights",

            error:
                error.message

        });

    }

};


module.exports = {

    getInsights

};