import mongoose from "mongoose";

const employeeEntrySchema = new mongoose.Schema(
  {
    employeeId: String,
    name: String,
    date: String,
    type: String, // credit / debit / salary
    amount: Number,
    month: String,
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeEntry", employeeEntrySchema);