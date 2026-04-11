/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";

// ENV load
dotenv.config();

// DNS fix (MongoDB SRV issue)
dns.setDefaultResultOrder("ipv4first");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug (remove later)
console.log("MONGO_URL:", process.env.MONGO_URL);

// ROUTES IMPORT
import authRoutes from "./routes/authRoute.js";
import customerRoutes from "./routes/customerRoute.js";
import dailyChartRoutes from "./routes/dailyChartRoutes.js";
import chemicalRoutes from "./routes/chemicalRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import profitRoutes from "./routes/profitRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeEntryRoutes from "./routes/employeeEntryRoutes.js";

// ROUTES USE
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/daily-chart", dailyChartRoutes);
app.use("/api/chemical", chemicalRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/employee-entry", employeeEntryRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Error ❌:", err.message);
  res.status(500).json({ message: "Server Error" });
});

// START SERVER FIRST
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

// DB CONNECT (SAFE)
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.log("⚠️ MONGO_URL missing");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("Mongo Error ❌:", err.message);
  }
};

connectDB();

// CRASH HANDLER
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception ❌:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection ❌:", err.message);
});