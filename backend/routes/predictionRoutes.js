const express = require("express");

const router = express.Router();


const {
    getPrediction
} = require(
    "../controllers/PredictionController"
);


router.post(
    "/",
    getPrediction
);


module.exports = router;