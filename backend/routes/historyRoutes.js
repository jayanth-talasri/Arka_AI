const express = require("express");

const router = express.Router();

const {
    getHistory
} = require("../services/historyService");


router.get("/", getHistory);


module.exports = router;