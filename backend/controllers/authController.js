const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================

const registerUser = async (req, res) => {

    try {

        console.log("REGISTER BODY:", req.body);
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }

        const existingUser = await pool.query(
            `
            SELECT id
            FROM public.users
            WHERE email = $1
            `,
            [email]
        );

        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO public.users
            (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );

        return res.status(201).json({

            success: true,
            
            message: "User registered successfully",
            user: result.rows[0]

        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"

        });

    }
};

// ==========================================
// LOGIN
// ==========================================

const loginUser = async (req, res) => {

    try {

        console.log("LOGIN BODY:", req.body);
        const { email, password } = req.body || {};

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        console.log("LOGIN ATTEMPT:", email);

        // ==================================
        // FIND USER
        // ==================================

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                password,
                created_at
            FROM public.users
            WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const user = result.rows[0];

        // ==================================
        // CHECK PASSWORD
        // ==================================

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,
                message: "Invalid email or password"

            });

        }

        // ==================================
        // CREATE JWT
        // ==================================

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );

        console.log("LOGIN SUCCESS:", user.email);

        // ==================================
        // RESPONSE
        // ==================================

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error("========== LOGIN ERROR ==========");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};


module.exports = {
    registerUser,
    loginUser
};