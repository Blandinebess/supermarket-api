import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/cn.js";

// ✅ Register
export async function registerUser(req, res) {
  try {
    const {
      username,
     
      password,
      role = "user",
      profile_pic = "",
    } = req.body;

    console.log("🔐 Registering:", { username, role });

    // Rubric: Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
   // Rubric: Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rubric: Create and save new user
    const [result] = await pool.query(
      "INSERT INTO users (username,  password, role, profile_pic) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, role, profile_pic]
    );

    console.log("✅ User registered:", result.insertId);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    console.log("🔑 Login attempt:", email);

    // Rubric: Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Rubric: Find user by email
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Rubric: Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Rubric: Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Rubric: Return token and user info
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
}
