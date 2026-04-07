import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);