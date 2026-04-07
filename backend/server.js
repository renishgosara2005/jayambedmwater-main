/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import authRoutes from "./routes/authRoute.js";
import customerRoutes from "./routes/customerRoute.js";
import dailyChartRoutes from "./routes/dailyChartRoutes.js";
import chemicalRoutes from "./routes/chemicalRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import profitRoutes from "./routes/profitRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeEntryRoutes from "./routes/employeeEntryRoutes.js"; // 👉 NEW 🔥

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ DEBUG LOGS
console.log("Auth Route Loaded ✅");
console.log("Customer Route Loaded ✅");
console.log("DailyChart Route Loaded ✅");
console.log("Chemical Route Loaded ✅");
console.log("Expense Route Loaded ✅");
console.log("Shopping Route Loaded ✅");
console.log("Profit Route Loaded ✅");
console.log("Employee Route Loaded ✅");
console.log("Employee Entry Route Loaded ✅"); // 👉 NEW

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/daily-chart", dailyChartRoutes);
app.use("/api/chemical", chemicalRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/employee", employeeRoutes);

// 👉 NEW (MAIN 🔥)
app.use("/api/employee-entry", employeeEntryRoutes);

// ✅ ROOT API
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Error ❌", err.message);
  res.status(500).json({ message: "Server Error" });
});

// ✅ DB CONNECT
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("Mongo Error ❌", err);
    process.exit(1);
  }
};

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT} 🚀`);
});