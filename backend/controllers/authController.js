
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER
// ==========================================

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", {
      ...req.body,
      password: req.body?.password ? "[RECEIVED]" : undefined,
    });

    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Check existing account
    const existingUser = await pool.query(
      `SELECT id FROM public.users WHERE LOWER(email) = $1`,
      [cleanEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const result = await pool.query(
      `
      INSERT INTO public.users
        (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
      `,
      [cleanName, cleanEmail, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed due to a server error.",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
      SELECT id, name, email, password, created_at
      FROM public.users
      WHERE LOWER(email) = $1
      `,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed due to a server error.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
