import express from "express";
import multer from "multer";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { pool } from "../db/cn.js";

export const authRouter = express.Router();

// ✅ Logger middleware (rubric)
authRouter.use((req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Multer setup for profile picture upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Register
authRouter.post("/register", registerUser);

// ✅ Login
authRouter.post("/login", loginUser);

// ✅ Get current user info (protected)
authRouter.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Decoded user:", req.user);

    const [rows] = await pool.query(
      "SELECT username, role, profile_pic FROM users WHERE id = ?",
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error in /auth/me:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload profile picture
authRouter.post(
  "/:username/upload-picture",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const imageBuffer = req.file.buffer;
      const imageBase64 = imageBuffer.toString("base64");

      const [result] = await pool.query(
        "UPDATE users SET profile_pic = ? WHERE username = ?",
        [imageBase64, req.params.username]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile picture uploaded successfully" });
    } catch (err) {
      console.error("Error in upload-picture:", err.message);
      res.status(500).json({ message: "Image upload failed" });
    }
  }
);
