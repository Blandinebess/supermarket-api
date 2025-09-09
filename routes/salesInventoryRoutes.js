import express from "express";
import {
  getAllSalesInventory,
  getSalesInventoryById,
  createSalesInventory,
  updateSalesInventory,
  deleteSalesInventory,
} from "../controllers/salesInventoryController.js";

const router = express.Router();

// GET all sales_inventory records
router.get("/", getAllSalesInventory);

// GET by contains_id
router.get("/:id", getSalesInventoryById);

// CREATE new record
router.post("/", createSalesInventory);

// UPDATE record
router.put("/:id", updateSalesInventory);

// DELETE record
router.delete("/:id", deleteSalesInventory);

export default router;
