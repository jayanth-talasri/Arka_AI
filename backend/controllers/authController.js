const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });

        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2) {

            return res.status(400).json({
                success: false,
                message: "Name must contain at least 2 characters"
            });

        }

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });

        }

        // ==========================================
        // CHECK EXISTING USER
        // ==========================================

        const existingUser = await pool.query(
            `
            SELECT id
            FROM public.users
            WHERE email = $1
            `,
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // ==========================================
        // CREATE USER
        // ==========================================

        const newUser = await pool.query(
            `
            INSERT INTO public.users
                (name, email, password)
            VALUES
                ($1, $2, $3)
            RETURNING
                id,
                name,
                email,
                created_at
            `,
            [
                cleanName,
                cleanEmail,
                hashedPassword
            ]
        );

        return res.status(201).json({

            success: true,

            message: "User registered successfully",

            user: newUser.rows[0]

        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log("LOGIN ATTEMPT:", email);

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await pool.query(
            `
            SELECT *
            FROM public.users
            WHERE email = $1
            `,
            [email]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

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

        console.log("✅ LOGIN SUCCESS:", user.email);

        return res.status(200).json({

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
            message: "Internal server error"
        });

    }
};

module.exports = {
    registerUser,
    loginUser
};