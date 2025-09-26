import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db/cn.js";

const router = express.Router();

// ✅ Multer setup for product image uploads
const storage = multer.diskStorage({
  destination: "uploads/products",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Get all products
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM inventory");
  res.json(rows);
});

// ✅ Add a new product
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  await pool.query(
    "INSERT INTO inventory (name, price, stock) VALUES (?, ?, ?)",
    [name, price, stock]
  );
  res.status(201).json({ message: "Product added" });
});

// ✅ Update a product
router.put("/:id", async (req, res) => {
  const { name, price, stock } = req.body;
  await pool.query(
    "UPDATE inventory SET name=?, price=?, stock=? WHERE product_id=?",
    [name, price, stock, req.params.id]
  );
  res.json({ message: "Product updated" });
});

// ✅ Delete a product
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM inventory WHERE product_id=?", [req.params.id]);
  res.json({ message: "Product deleted" });
});

// ✅ Upload product image
router.post("/:id/upload-picture", upload.single("image"), async (req, res) => {
  const imageUrl = `/uploads/products/${req.file.filename}`;
  await pool.query("UPDATE inventory SET image_url=? WHERE product_id=?", [
    imageUrl,
    req.params.id,
  ]);
  res.json({ message: "Image uploaded", imageUrl });
});

// ✅ Inventory value card
router.get("/value", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT SUM(price * stock) AS total_value FROM inventory"
  );
  res.json(rows[0]);
});

// ✅ Top 5 products by units sold
router.get("/top/units", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT i.name, SUM(si.quantity) AS units_sold
    FROM sales_inventory si
    JOIN inventory i ON si.product_id = i.product_id
    GROUP BY si.product_id
    ORDER BY units_sold DESC
    LIMIT 5
  `);
  res.json(rows);
});

// ✅ Low stock products
router.get("/low-stock/:threshold", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM inventory WHERE stock <= ?", [
    req.params.threshold,
  ]);
  res.json(rows);
});

export const inventory = router;
