import express from "express";
import {
  createShopping,
  getShopping,
  deleteShopping,
  updateShopping,
} from "../controllers/shoppingController.js";

const router = express.Router();

router.post("/", createShopping);
router.get("/", getShopping);
router.delete("/:id", deleteShopping);
router.put("/:id", updateShopping);

export default router;