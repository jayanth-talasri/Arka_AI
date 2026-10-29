
const axios = require("axios");

const {
  getUserSettings,
} = require("../services/userSettingsService");

/**
 * Convert different AI backend response formats
 * into one consistent array of insight strings/objects.
 */
const extractInsights = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "string" && payload.trim()) {
    return [payload];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  // Common FastAPI response formats
  const possibleValues = [
    payload.insights,
    payload.data?.insights,
    payload.result?.insights,
    payload.results,
    payload.recommendations,
    payload.data,
    payload.result,
  ];

  for (const value of possibleValues) {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      return [value];
    }
  }

  // Support a single insight object
  if (
    payload.insight ||
    payload.message ||
    payload.recommendation
  ) {
    return [
      payload.insight ||
      payload.message ||
      payload.recommendation,
    ];
  }

  return [];
};

const getInsights = async (req, res) => {
  try {
    // 1. Authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    // 2. Date parameters
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Start and end query parameters are required.",
      });
    }

    // 3. User settings
    const settings = await getUserSettings(userId);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "User settings not found. Please configure settings first.",
      });
    }

    const latitude = Number(settings.latitude);
    const longitude = Number(settings.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required in user settings.",
      });
    }

    // 4. AI backend configuration
    const aiBackendUrl = process.env.AI_BACKEND_URL;
    const aiApiKey = process.env.AI_API_KEY;

    if (!aiBackendUrl || !aiApiKey) {
      console.error("AI backend URL or API key is missing.");

      return res.status(500).json({
        success: false,
        message: "AI backend configuration is incomplete.",
      });
    }

    // 5. Request AI insights
    console.log("========== INSIGHTS REQUEST ==========");
    console.log("User:", userId);
    console.log("Start:", start);
    console.log("End:", end);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    const response = await axios.get(
      `${aiBackendUrl.replace(/\/$/, "")}/insights`,
      {
        params: {
          latitude,
          longitude,
          start,
          end,
        },
        headers: {
          "X-AI-API-Key": aiApiKey,
        },
        timeout: 120000,
      }
    );

    // 6. Normalize AI response
    console.log(
      "AI backend response type:",
      Array.isArray(response.data)
        ? "array"
        : typeof response.data
    );

    console.log(
      "AI backend response keys:",
      response.data && typeof response.data === "object"
        ? Object.keys(response.data)
        : []
    );

    const insights = extractInsights(response.data);

    console.log(
      "Normalized insights count:",
      insights.length
    );

    console.log("======================================");

    // 7. Consistent frontend response
    return res.status(200).json({
      success: true,
      user_id: userId,
      insights,
    });

  } catch (error) {
    console.error("========== INSIGHTS ERROR ==========");

    if (error.response) {
      console.error(
        "AI backend status:",
        error.response.status
      );

      console.error(
        "AI backend response:",
        error.response.data
      );

      return res.status(502).json({
        success: false,
        message: "AI backend insights request failed.",
        error: error.response.data,
      });
    }

    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch insights.",
      error: error.message,
    });
  }
};

module.exports = {
  getInsights,
};
