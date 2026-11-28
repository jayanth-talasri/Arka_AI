
const pool = require("../config/db");
const {
    parseAppliances
} = require("../services/userSettingsService");

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
            LIMIT 1
            `,
            [userId]
        );

        if (!result.rows.length) {
            return res.status(200).json({
                success: true,
                settings: null
            });
        }

        const settings = result.rows[0];

        return res.status(200).json({
            success: true,
            settings: {
                ...settings,
                latitude: settings.latitude === null
                    ? null : Number(settings.latitude),
                longitude: settings.longitude === null
                    ? null : Number(settings.longitude),
                solar_capacity: settings.solar_capacity === null
                    ? null : Number(settings.solar_capacity),
                electricity_rate: settings.electricity_rate === null
                    ? null : Number(settings.electricity_rate),
                appliances: parseAppliances(settings.appliance_info)
            }
        });

    } catch (error) {
        console.error("GET SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch settings"
        });
    }
};

const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            location,
            latitude,
            longitude,
            solar_capacity,
            electricity_rate
        } = req.body;

        const appliances = parseAppliances(
            req.body.appliances ?? req.body.appliance_info
        );

        if (!location || !String(location).trim()) {
            return res.status(400).json({
                success: false,
                message: "Location is required."
            });
        }

        const lat = Number(latitude);
        const lon = Number(longitude);
        const capacity = Number(solar_capacity);
        const rate = Number(electricity_rate);

        if (
            latitude === undefined || latitude === null || latitude === "" ||
            longitude === undefined || longitude === null || longitude === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required."
            });
        }

        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid latitude between -90 and 90."
            });
        }

        if (!Number.isFinite(lon) || lon < -180 || lon > 180) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid longitude between -180 and 180."
            });
        }

        if (
            solar_capacity === undefined ||
            solar_capacity === null ||
            solar_capacity === "" ||
            !Number.isFinite(capacity) ||
            capacity < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid non-negative solar capacity."
            });
        }

        if (
            electricity_rate === undefined ||
            electricity_rate === null ||
            electricity_rate === "" ||
            !Number.isFinite(rate) ||
            rate < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid non-negative electricity tariff."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO public.user_settings (
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())

            ON CONFLICT (user_id)

            DO UPDATE SET
                location = EXCLUDED.location,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                solar_capacity = EXCLUDED.solar_capacity,
                electricity_rate = EXCLUDED.electricity_rate,
                appliance_info = EXCLUDED.appliance_info,
                updated_at = NOW()

            RETURNING *
            `,
            [
                userId,
                String(location).trim(),
                lat,
                lon,
                capacity,
                rate,
                appliances.join(", ")
            ]
        );

        const saved = result.rows[0];

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: {
                ...saved,
                latitude: Number(saved.latitude),
                longitude: Number(saved.longitude),
                solar_capacity: Number(saved.solar_capacity),
                electricity_rate: Number(saved.electricity_rate),
                appliances
            }
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