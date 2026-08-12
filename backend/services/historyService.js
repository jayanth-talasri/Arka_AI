const pool = require("../config/db");


// ==========================================
// GET USER HISTORY
// ==========================================

const getHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                predicted_radiation,
                estimated_energy,
                estimated_savings,
                status,
                created_at
            FROM prediction_history
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            history: result.rows
        });

    } catch (error) {

        console.error("History error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch history"
        });

    }
};


module.exports = {
    getHistory
};