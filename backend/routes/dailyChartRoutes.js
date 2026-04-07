import express from "express";
import {
  createDailyChart,
  getDailyChart,
  updateDailyChart,
  deleteDailyChart,
} from "../controllers/dailyChartController.js";

const router = express.Router();

// ✅ IMPORTANT
router.post("/", createDailyChart);
router.get("/", getDailyChart);
router.put("/:id", updateDailyChart);
router.delete("/:id", deleteDailyChart);

export default router;  