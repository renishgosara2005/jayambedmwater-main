import express from "express";
import {
  addEntry,
  getEntries,
  deleteEntry,
  getWater,
} from "../controllers/employeeEntryController.js";

const router = express.Router();

// ✅ ADD ENTRY
router.post("/", addEntry);

// ✅ GET ENTRY
router.get("/:id", getEntries);

// ✅ DELETE
router.delete("/:id", deleteEntry);

// ✅ WATER
router.get("/water/by-date", getWater);

export default router;