import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String, unique: true, sparse: true },
    address: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: true },
    // Thông tin khách hàng (chỉ dành cho role = 'user')
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema, "users");
