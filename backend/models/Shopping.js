import mongoose from "mongoose";

const shoppingSchema = new mongoose.Schema(
  {
    name: String,
    supplier: String,
    price: Number,
    date: String,
  },
  { timestamps: true }
);

export default mongoose.model("Shopping", shoppingSchema);