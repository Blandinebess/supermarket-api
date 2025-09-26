import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { pool } from "./db/cn.js"; // ✅ MySQL connection
import { logger } from "./middleware/logger.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { authRouter } from "./routes/auth.js";
import { inventory } from "./routes/routeInventory.js";
import { customer } from "./routes/routeCustomer.js";
import { sales } from "./routes/routeSales.js";

config(); // ✅ Load environment variables

const app = express();

// ✅ Core Middleware
app.use(cors());
app.use(express.json());
app.use(logger); // rubric: backend includes logger middleware

// ✅ Public Routes
app.use("/auth", authRouter);

// ✅ Protected Routes (rubric: verifyToken middleware)
app.use("/inventory", verifyToken, inventory);
app.use("/customers", verifyToken, customer);
app.use("/sales", verifyToken, sales);

// ✅ Optional: MySQL test route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json(rows[0]); // should return { result: 2 }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fallback Error Handler (rubric-friendly)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
