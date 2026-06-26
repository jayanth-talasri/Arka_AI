const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getSettings,
  saveSettings,
} = require("../controllers/settingsController");

router.get("/", verifyToken, getSettings);

router.put("/", verifyToken, saveSettings);

module.exports = router;