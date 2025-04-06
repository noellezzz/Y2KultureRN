import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: Number,
  product: String,
  category: String,
  price: Number,
  quantity: Number,
  color: String,
  size: String,
  image: String,
});

const orderSchema = new mongoose.Schema({
  id: Number,
  date: String,
  total: Number,
  status: String,
  deliveryAddress: String,
  items: [orderItemSchema],
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  name: { type: String, required: false },
  role: { type: String, default: "Standard User" },
  phone: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  wallet: { type: Number, default: 0 },
  orders: [orderSchema],
  image: { type: String, default: null },
  cloudinaryId: { type: String, default: null },
  age: { type: Number, required: false },
  gender: { type: String, required: false, enum: ["Male", "Female", "Other"] },
});

export default mongoose.model("User", userSchema);
