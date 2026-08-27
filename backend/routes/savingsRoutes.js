const express = require("express");

const router = express.Router();


const {
    getSavings
} = require("../controllers/savingsController");


router.get(
    "/",
    getSavings
);


module.exports = router;