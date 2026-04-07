import express from "express";
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/add", addCustomer);
router.get("/", getCustomers);
router.put("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;