const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getForecast
} = require("../controllers/forecastController");

router.get("/", verifyToken, getForecast);

module.exports = router;