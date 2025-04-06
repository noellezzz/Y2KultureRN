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

const promoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  percentOff: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "scheduled", "expired"],
    default: "inactive",
  },
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
  promo: promoSchema,
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

// Add a method to calculate discounted price based on active promotion
productSchema.methods.getDiscountedPrice = function () {
  if (this.promo && this.promo.status === "active") {
    const discount = this.price * (this.promo.percentOff / 100);
    return Math.round((this.price - discount) * 100) / 100;
  }
  return this.price;
};

export default mongoose.model("Product", productSchema);
