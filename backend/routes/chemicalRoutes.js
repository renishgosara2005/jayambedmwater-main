import express from "express";
import {
  createChemical,
  getChemicals,
  deleteChemical,
} from "../controllers/chemicalController.js";

const router = express.Router();

router.post("/", createChemical);
router.get("/", getChemicals);
router.delete("/:id", deleteChemical);

export default router;