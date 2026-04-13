import express from "express";
import {
  addDailyChart,
  getDailyChart,
  updateDailyChart,
  deleteDailyChart,
} from "../controllers/dailyChartController.js";

const router = express.Router();

router.post("/", addDailyChart);
router.get("/", getDailyChart);
router.put("/:id", updateDailyChart);
router.delete("/:id", deleteDailyChart);

export default router;