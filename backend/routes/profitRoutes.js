import express from "express";
import { getProfit } from "../controllers/profitController"
const router = express.Router();

router.get("/", getProfit);

export default router;  