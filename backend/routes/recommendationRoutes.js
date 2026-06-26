const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getRecommendations
} = require("../controllers/recommendationController");

router.get("/", verifyToken, getRecommendations);

module.exports = router;