import express from "express";
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

// GET all sales
router.get("/", getAllSales);

// GET sale by ID
router.get("/:id", getSaleById);

// CREATE new sale
router.post("/", createSale);

// UPDATE sale
router.put("/:id", updateSale);

// DELETE sale
router.delete("/:id", deleteSale);

export default router;
