import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  price: Number,
  
  date: String,

  q1: Number,
  q2: Number,
  q3: Number,
  q4: Number,
  q5: Number,
  q6: Number,
  q7: Number,

  q1_emp: String,
  q2_emp: String,
  q3_emp: String,
  q4_emp: String,
  q5_emp: String,
  q6_emp: String,
  q7_emp: String,

  total: Number,
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);