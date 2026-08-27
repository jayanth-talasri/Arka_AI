const express = require("express");

const router = express.Router();


const {
    getSolarScore
} = require(
    "../controllers/solarScoreController"
);


router.get(
    "/",
    getSolarScore
);


module.exports = router;