const express = require("express");

const router = express.Router();


const {
    getCarbonImpact
} = require(
    "../controllers/carbonController"
);


router.get(
    "/",
    getCarbonImpact
);


module.exports = router;