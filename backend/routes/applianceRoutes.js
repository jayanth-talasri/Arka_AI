const express = require("express");

const router = express.Router();

const {
    getAppliances
} = require("../controllers/applianceController");

router.get("/", getAppliances);

module.exports = router;