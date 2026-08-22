require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const { authenticate } = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const historyRoutes = require("./routes/historyRoutes");
const applianceRoutes = require("./routes/applianceRoutes");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// IMPORTANT
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ==========================================
// PUBLIC ROUTES
// ==========================================

app.use("/api/auth", authRoutes);


// ==========================================
// PROTECTED ROUTES
// ==========================================

app.use("/api/user", authenticate, userRoutes);

app.use("/api/settings", authenticate, settingsRoutes);

app.use("/api/forecast", authenticate, forecastRoutes);

app.use("/api/recommendations", authenticate, recommendationRoutes);

app.use("/api/analytics", authenticate, analyticsRoutes);

app.use("/api/history", authenticate, historyRoutes);

app.use("/api/appliances", authenticate, applianceRoutes);
// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "ArkaAI Backend Running",
        status: "healthy"
    });

});


// ==========================================
// DATABASE TEST
// ==========================================

app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_user AS user,
                NOW() AS server_time
        `);

        res.json({
            success: true,
            database: result.rows[0].database,
            user: result.rows[0].user,
            server_time: result.rows[0].server_time
        });

    } catch (error) {

        console.error("Database test error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });

    }

});


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found"
    });

});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error("Unhandled error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log(`ArkaAI Backend running on port ${PORT}`);
    console.log("=================================");

});