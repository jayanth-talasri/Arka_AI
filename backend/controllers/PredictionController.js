const axios = require("axios");


const getPrediction = async (req, res) => {

    try {

        const {

            temperature,
            humidity,
            wind_speed,
            month,
            day,
            dayofyear,
            season,
            previous_radiation

        } = req.body;


        // ==========================================
        // VALIDATE REQUIRED FEATURES
        // ==========================================

        const requiredFields = [

            temperature,
            humidity,
            wind_speed,
            month,
            day,
            dayofyear,
            season,
            previous_radiation

        ];


        if (
            requiredFields.some(
                value =>
                    value === undefined ||
                    value === null
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All prediction features are required"

            });

        }


        // ==========================================
        // CALL AI BACKEND
        // ==========================================

        const aiBackendUrl =
            process.env.AI_BACKEND_URL;


        const response =
            await axios.post(

                `${aiBackendUrl}/predict`,

                {

                    temperature,

                    humidity,

                    wind_speed,

                    month,

                    day,

                    dayofyear,

                    season,

                    previous_radiation

                },

                {

                    headers: {

                        "X-AI-API-Key":
                            process.env.AI_API_KEY

                    },

                    timeout: 120000

                }

            );


        return res.status(200).json({

            success: true,

            prediction:
                response.data

        });

    } catch (error) {

        console.error(
            "========== PREDICTION ERROR =========="
        );


        if (error.response) {

            return res
                .status(error.response.status)
                .json({

                    success: false,

                    message:
                        "AI backend prediction failed",

                    error:
                        error.response.data

                });

        }


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate prediction",

            error:
                error.message

        });

    }

};


module.exports = {
    getPrediction
};