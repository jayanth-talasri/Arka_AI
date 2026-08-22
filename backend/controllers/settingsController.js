const pool = require("../config/db");

// ==========================================
// GET USER SETTINGS
// ==========================================

const getSettings = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                location,
                latitude,
                longitude,
                solar_capacity,
                electricity_rate,
                appliance_info,
                created_at,
                updated_at
            FROM public.user_settings
            WHERE user_id = $1
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            settings: result.rows[0] || null
        });

    } catch (error) {

        console.error("GET SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch settings"
        });
    }
};


// ==========================================
// UPDATE USER SETTINGS
// ==========================================

const updateSettings = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            location,
            latitude,
            longitude,
            solar_capacity,
            electricity_rate,
            appliance_info
        } = req.body;

        if (!location || latitude === undefined || longitude === undefined) {

            return res.status(400).json({
                success: false,
                message: "Location, latitude and longitude are required"
            });

        }

        if (
            solar_capacity === undefined ||
            electricity_rate === undefined
        ) {

            return res.status(400).json({
                success: false,
                message: "Solar capacity and electricity rate are required"
            });

        }

        const result = await pool.query(
            `
            INSERT INTO public.user_settings
            (
                user_id,
                location,
                latitude,
                longitude,
                solar_capacity,
                electricity_rate,
                appliance_info,
                created_at,
                updated_at
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                NOW(),
                NOW()
            )

            ON CONFLICT (user_id)

            DO UPDATE SET

                location = EXCLUDED.location,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                solar_capacity = EXCLUDED.solar_capacity,
                electricity_rate = EXCLUDED.electricity_rate,
                appliance_info = EXCLUDED.appliance_info,
                updated_at = NOW()

            RETURNING
                id,
                user_id,
                location,
                latitude,
                longitude,
                solar_capacity,
                electricity_rate,
                appliance_info,
                created_at,
                updated_at
            `,
            [
                userId,
                location,
                latitude,
                longitude,
                solar_capacity,
                electricity_rate,
                appliance_info || null
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: result.rows[0]
        });

    } catch (error) {

        console.error("UPDATE SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update settings"
        });
    }
};


module.exports = {
    getSettings,
    updateSettings
};