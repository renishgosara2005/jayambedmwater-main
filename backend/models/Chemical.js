import mongoose from "mongoose";

const chemicalSchema = new mongoose.Schema({
  type: { type: String, required: true }, // costic / acid
  bag: String,
  container: String,
  price: Number,
  date: String,
});

export default mongoose.model("Chemical", chemicalSchema);  