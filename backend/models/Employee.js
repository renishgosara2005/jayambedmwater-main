import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    work: String,
    salary: Number,
    advance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);