import express from "express";
import {
  addEntry,
  getEntriesByEmployee,
  deleteEntry,
  getWaterByDate,
} from "../controllers/employeeEntryController.js";

const router = express.Router();

// ✅ ADD ENTRY
router.post("/", addEntry);

// ✅ GET BY EMPLOYEE
router.get("/:id", getEntriesByEmployee);

// ✅ DELETE
router.delete("/:id", deleteEntry);

// ✅ WATER API
router.get("/water/by-date", getWaterByDate);

export default router;