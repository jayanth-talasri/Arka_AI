const express = require("express");

const router = express.Router();

const {
    getUserProfile,
    updateUserProfile,
    getAllUsers
} = require("../controllers/userController");


// ==========================================
// GET CURRENT USER
// ==========================================

router.get(
    "/profile",
    getUserProfile
);


// ==========================================
// UPDATE CURRENT USER
// ==========================================

router.put(
    "/profile",
    updateUserProfile
);


// ==========================================
// GET ALL USERS
// ==========================================
// Development/admin verification only

router.get(
    "/",
    getAllUsers
);


module.exports = router;