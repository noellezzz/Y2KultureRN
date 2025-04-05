import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  size: String,
  color: String,
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: null },
  cloudinaryId: { type: String, default: null },
  stock: [stockSchema],
  reviews: { type: Array, default: [] },
});

export default mongoose.model("Product", productSchema);
