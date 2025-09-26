import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db/cn.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/customers",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM customers");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  await pool.query(
    "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone]
  );
  res.status(201).json({ message: "Customer added" });
});

router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  await pool.query(
    "UPDATE customers SET name=?, email=?, phone=? WHERE customer_id=?",
    [name, email, phone, req.params.id]
  );
  res.json({ message: "Customer updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM customers WHERE customer_id=?", [
    req.params.id,
  ]);
  res.json({ message: "Customer deleted" });
});

router.post("/:id/upload-picture", upload.single("image"), async (req, res) => {
  const imageUrl = `/uploads/customers/${req.file.filename}`;
  await pool.query("UPDATE customers SET profile_pic=? WHERE customer_id=?", [
    imageUrl,
    req.params.id,
  ]);
  res.json({ message: "Image uploaded", imageUrl });
});

export const customer = router;
