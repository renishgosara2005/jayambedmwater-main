import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    driver: String,
    number: String,
    expense: Number,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);