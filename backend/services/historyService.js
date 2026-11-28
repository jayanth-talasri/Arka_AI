
const axios = require("axios");
const pool = require("../config/db");

const normalizeDate = (value) => {
  if (!/^\d{8}$/.test(value || "")) {
    return null;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const start = normalizeDate(req.query.start);
    const end = normalizeDate(req.query.end);

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Valid start and end dates are required in YYYYMMDD format."
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date."
      });
    }

    // 1. Retrieve saved PostgreSQL predictions
    const result = await pool.query(
      `
      SELECT
        id,
        start_date,
        end_date,
        predicted_radiation,
        estimated_energy,
        estimated_savings,
        status,
        recommendation,
        temperature,
        humidity,
        wind_speed,
        created_at
      FROM prediction_history
      WHERE user_id = $1
        AND start_date <= $3::date
        AND end_date >= $2::date
      ORDER BY start_date DESC, created_at DESC
      `,
      [userId, start, end]
    );

    // 2. Retrieve user's solar location
    const settingsResult = await pool.query(
      `
      SELECT
        location,
        latitude,
        longitude
      FROM public.user_settings
      WHERE user_id = $1
      `,
      [userId]
    );

    if (settingsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User solar location settings not found."
      });
    }

    const settings = settingsResult.rows[0];
    const latitude = Number(settings.latitude);
    const longitude = Number(settings.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required in user settings."
      });
    }

    // 3. Retrieve actual historical observations from NASA POWER
    let nasaData = null;
    let nasaError = null;

    try {
      const aiBackendUrl = process.env.AI_BACKEND_URL;
      const aiApiKey = process.env.AI_API_KEY;

      if (!aiBackendUrl || !aiApiKey) {
        throw new Error("AI backend configuration is missing.");
      }

      const response = await axios.get(
        `${aiBackendUrl.replace(/\/+$/, "")}/history`,
        {
          params: {
            latitude,
            longitude,
            start: req.query.start,
            end: req.query.end
          },
          headers: {
            "X-AI-API-Key": aiApiKey
          },
          timeout: 120000
        }
      );

      nasaData = response.data;
    } catch (error) {
      console.error(
        "NASA historical data error:",
        error.response?.data || error.message
      );

      nasaError =
        error.response?.data?.detail ||
        error.message ||
        "Unable to retrieve NASA historical data.";
    }

    // 4. Return both sources separately
    return res.status(200).json({
      success: true,
      start_date: start,
      end_date: end,
      total_records: result.rows.length,

      settings: {
        location: settings.location,
        latitude,
        longitude
      },

      history: result.rows,

      nasa_history: nasaData,
      nasa_error: nasaError
    });

  } catch (error) {
    console.error("History error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch history"
    });
  }
};

module.exports = { getHistory };