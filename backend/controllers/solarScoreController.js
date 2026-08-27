const axios = require("axios");

const {
    getUserSettings
} = require("../services/userSettingsService");


const getSolarScore = async (req, res) => {

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


        const settings =
            await getUserSettings(userId);


        if (!settings) {

            return res.status(404).json({
                success: false,
                message:
                    "User settings not found."
            });

        }


        const latitude =
            Number(settings.latitude);

        const longitude =
            Number(settings.longitude);

        const solarCapacity =
            Number(settings.solar_capacity);


        const aiBackendUrl =
            process.env.AI_BACKEND_URL;


        console.log(
            "========== SOLAR SCORE =========="
        );


        const response = await axios.get(
            `${aiBackendUrl}/solar-score`,
            {
                params: {
                    latitude,
                    longitude,
                    start,
                    end,
                    solar_capacity: solarCapacity
                },

                headers: {
                    "X-AI-API-Key":
                        process.env.AI_API_KEY
                },

                timeout: 120000
            }
        );


        return res.status(200).json({

            success: true,

            user_id: userId,

            settings: {
                location: settings.location,
                latitude,
                longitude,
                solar_capacity: solarCapacity
            },

            solar_score: response.data

        });


    } catch (error) {

        console.error(
            "========== SOLAR SCORE ERROR =========="
        );


        if (error.response) {

            return res
                .status(error.response.status)
                .json({

                    success: false,

                    message:
                        "AI backend solar score request failed",

                    error:
                        error.response.data

                });

        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch solar score",

            error:
                error.message

        });

    }

};


module.exports = {
    getSolarScore
};