import express from "express";
import { pool } from "../db/cn.js";

const router = express.Router();

// ✅ Create a new sale
router.post("/", async (req, res) => {
  try {
    const { customer_id, total_amount } = req.body;
    const [result] = await pool.query(
      "INSERT INTO sales (customer_id, date, total_amount) VALUES (?, NOW(), ?)",
      [customer_id, total_amount]
    );
    res.status(201).json({ sale_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add items to a sale and update stock
router.post("/:sale_id/items", async (req, res) => {
  try {
    const { items } = req.body;
    const sale_id = req.params.sale_id;

    for (const item of items) {
      await pool.query(
        "INSERT INTO sales_inventory (sale_id, product_id, quantity) VALUES (?, ?, ?)",
        [sale_id, item.product_id, item.quantity]
      );

      await pool.query(
        "UPDATE inventory SET stock = stock - ? WHERE product_id = ?",
        [item.quantity, item.product_id]
      );
    }

    res.status(200).json({ message: "Items added and stock updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ List all sales with customer and item details
router.get("/", async (req, res) => {
  try {
    const [sales] = await pool.query(`
      SELECT s.sales_id, s.date, s.total_amount, c.name AS customer_name
      FROM sales s
      JOIN customers c ON s.customer_id = c.customer_id
      ORDER BY s.date DESC
    `);

    const detailedSales = [];

    for (const sale of sales) {
      const [items] = await pool.query(
        `
        SELECT i.name, si.quantity, i.price
        FROM sales_inventory si
        JOIN inventory i ON si.product_id = i.product_id
        WHERE si.sale_id = ?
      `,
        [sale.sales_id]
      );

      detailedSales.push({ ...sale, items });
    }

    res.json(detailedSales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Sales summary: total sales and revenue
router.get("/summary", async (req, res) => {
  try {
    const [summary] = await pool.query(`
      SELECT COUNT(*) AS total_sales, SUM(total_amount) AS total_revenue
      FROM sales
    `);
    res.json(summary[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const sales = router;
