import db from "../models/db.js";

exports.getAllSalesInventory = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sales_inventory");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalesInventoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM sales_inventory WHERE contains_id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSalesInventory = async (req, res) => {
  const { sales_id, product_id, quantity } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO sales_inventory (sales_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [sales_id, product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSalesInventory = async (req, res) => {
  const { id } = req.params;
  const { sales_id, product_id, quantity } = req.body;
  try {
    const result = await db.query(
      "UPDATE sales_inventory SET sales_id = $1, product_id = $2, quantity = $3 WHERE contains_id = $4 RETURNING *",
      [sales_id, product_id, quantity, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSalesInventory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM sales_inventory WHERE contains_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
