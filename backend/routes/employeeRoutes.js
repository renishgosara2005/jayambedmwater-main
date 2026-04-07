import express from "express";
import {
  createEmployee,
  getEmployees,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
router.delete("/:id", deleteEmployee);

export default router;