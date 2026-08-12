require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { authenticate } = require("./middleware/authMiddleware");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const userRoutes = require("./routes/userRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const historyRoutes = require("./routes/historyRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/history", authenticate, historyRoutes);

app.use("/api/user", authenticate, userRoutes);

app.use("/api/settings", authenticate, settingsRoutes);

app.use("/api/forecast",  forecastRoutes);

app.use("/api/recommendations",  recommendationRoutes);

app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("ArkaAI Backend Running...");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database Error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});