/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import dns from "dns";

// 🔥 LOAD ENV (IMPORTANT FIX)
dotenv.config({ path: "./.env" });

const app = express();
dns.setDefaultResultOrder("ipv4first");
// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 DEBUG (check env working)
console.log("MONGO_URL:", process.env.MONGO_URL);

// ✅ ROUTES IMPORT
import authRoutes from "./routes/authRoute.js";
import customerRoutes from "./routes/customerRoute.js";
import dailyChartRoutes from "./routes/dailyChartRoutes.js";
import chemicalRoutes from "./routes/chemicalRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import profitRoutes from "./routes/profitRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import employeeEntryRoutes from "./routes/employeeEntryRoutes.js";

// ✅ ROUTES USE
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/daily-chart", dailyChartRoutes);
app.use("/api/chemical", chemicalRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/profit", profitRoutes);
app.use("/api/employee", employeeRoutes);
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
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is missing in .env ❌");
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.log("Mongo Error ❌", err.message);
    process.exit(1);
  }
};

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
});
