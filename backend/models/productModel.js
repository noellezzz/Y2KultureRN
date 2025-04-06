import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

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
  reviews: [reviewSchema],
});

// Add a method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) return 0;

  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  return Math.round((totalRating / this.reviews.length) * 10) / 10;
};

export default mongoose.model("Product", productSchema);
