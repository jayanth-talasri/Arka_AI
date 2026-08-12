const express = require("express");

const router = express.Router();

const {
    getUserProfile,
    updateUserProfile
} = require("../controllers/userController");


// GET USER PROFILE
router.get("/profile", getUserProfile);


// UPDATE USER PROFILE
router.put("/profile", updateUserProfile);


module.exports = router;