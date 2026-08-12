const pool = require("../config/db");


// ==========================================
// GET USER PROFILE
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
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {

        console.error("Get user error:", error);

        res.status(500).json({
            message: "Failed to fetch user"
        });

    }
};


// ==========================================
// UPDATE USER PROFILE
// ==========================================

const updateUserProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const { name } = req.body;

        if (!name) {

            return res.status(400).json({
                message: "Name is required"
            });

        }

        const result = await pool.query(
            `
            UPDATE users
            SET name = $1
            WHERE id = $2
            RETURNING id, name, email, created_at
            `,
            [name, userId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.error("Update user error:", error);

        res.status(500).json({
            message: "Failed to update profile"
        });

    }
};


module.exports = {
    getUserProfile,
    updateUserProfile
};