import db from "../models/db.js";
// GET all sales
exports.getAllSales = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sales");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET sale by ID
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM sales WHERE sales_id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new sale
exports.createSale = async (req, res) => {
  const { date, customer_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO sales (date, customer_id) VALUES ($1, $2) RETURNING *",
      [date, customer_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE sale
exports.updateSale = async (req, res) => {
  const { id } = req.params;
  const { date, customer_id } = req.body;
  try {
    const result = await db.query(
      "UPDATE sales SET date = $1, customer_id = $2 WHERE sales_id = $3 RETURNING *",
      [date, customer_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE sale
exports.deleteSale = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM sales WHERE sales_id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
