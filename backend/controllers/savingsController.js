const axios = require("axios");

const {
    getUserSettings
} = require("../services/userSettingsService");


const getSavings = async (req, res) => {

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
        // USER SETTINGS
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

        const solarCapacity =
            Number(settings.solar_capacity);

        const electricityRate =
            Number(settings.electricity_rate);


        // ==========================================
        // AI BACKEND
        // ==========================================

        const aiBackendUrl =
            process.env.AI_BACKEND_URL;


        console.log(
            "========== SAVINGS =========="
        );

        console.log("User:", userId);
        console.log("Location:", latitude, longitude);
        console.log("Start:", start);
        console.log("End:", end);


        const response = await axios.get(
            `${aiBackendUrl}/savings`,
            {
                params: {
                    latitude,
                    longitude,
                    start,
                    end,
                    solar_capacity: solarCapacity,
                    electricity_rate: electricityRate
                },

                headers: {
                    "X-AI-API-Key":
                        process.env.AI_API_KEY
                },

                timeout: 120000
            }
        );


        console.log(
            "AI Savings response received"
        );


        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {
                location: settings.location,
                latitude,
                longitude,
                solar_capacity: solarCapacity,
                electricity_rate: electricityRate
            },

            savings: response.data

        });


    } catch (error) {

        console.error(
            "========== SAVINGS ERROR =========="
        );


        if (error.response) {

            return res
                .status(error.response.status)
                .json({

                    success: false,

                    message:
                        "AI backend savings request failed",

                    error:
                        error.response.data

                });

        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch savings",

            error:
                error.message

        });

    }

};


module.exports = {
    getSavings
};