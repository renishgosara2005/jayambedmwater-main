import mongoose from "mongoose";

const dailyChartSchema = new mongoose.Schema({
  name: String,
  date: String,
  price: Number,

  q1: { type: Number, default: 0 },
  q1_emp: String,
  q2: { type: Number, default: 0 },
  q2_emp: String,
  q3: { type: Number, default: 0 },
  q3_emp: String,
  q4: { type: Number, default: 0 },
  q4_emp: String,
  q5: { type: Number, default: 0 },
  q5_emp: String,
  q6: { type: Number, default: 0 },
  q6_emp: String,
  q7: { type: Number, default: 0 },
  q7_emp: String,
});

export default mongoose.model("DailyChart", dailyChartSchema);