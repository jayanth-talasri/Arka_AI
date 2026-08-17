const pool = require("../config/db");


// ==========================================
// GET CURRENT USER PROFILE
// ==========================================

const getUserProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                created_at
            FROM public.users
            WHERE id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        return res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {

        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });

    }

};


// ==========================================
// UPDATE CURRENT USER
// ==========================================

const updateUserProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const { name } = req.body;

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Name is required"
            });

        }

        const result = await pool.query(
            `
            UPDATE public.users
            SET name = $1
            WHERE id = $2
            RETURNING
                id,
                name,
                email,
                created_at
            `,
            [name.trim(), userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.error("Update user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });

    }

};


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                created_at
            FROM public.users
            ORDER BY id ASC
            `
        );

        return res.json({
            success: true,
            count: result.rows.length,
            users: result.rows
        });

    } catch (error) {

        console.error("Get all users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });

    }

};


module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers
};