import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const addReview = async (req, res) => {
  try {
    console.log("Add Review Request Received");
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);

    const { userId } = req.params;
    const productId = req.params.productId || req.body.productId;

    // Validate productId
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        params: req.params,
        body: req.body,
      });
    }

    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        productId: productId,
      });
    }

    // Check if user has a delivered order for this product
    const hasDeliveredOrder = user.orders.some(
      (order) =>
        order.status === "Delivered" &&
        order.items.some((item) => item.product === product.name)
    );

    if (!hasDeliveredOrder) {
      return res.status(403).json({
        message: "You can only review products from delivered orders",
      });
    }

    // Check if user has already reviewed this product
    const existingReviewIndex = product.reviews.findIndex(
      (review) => review.user.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    // Add new review
    const newReview = {
      user: userId,
      rating,
      comment,
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
      averageRating: product.calculateAverageRating(),
    });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { userId, productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    // Validate input
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the review
    const reviewIndex = product.reviews.findIndex(
      (review) =>
        review._id.toString() === reviewId && review.user.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the review
    product.reviews[reviewIndex].rating = rating;
    product.reviews[reviewIndex].comment = comment;
    product.reviews[reviewIndex].updatedAt = new Date();

    await product.save();

    res.status(200).json({
      message: "Review updated successfully",
      review: product.reviews[reviewIndex],
      averageRating: product.calculateAverageRating(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { userId, productId, reviewId } = req.params;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the review index
    const reviewIndex = product.reviews.findIndex(
      (review) =>
        review._id.toString() === reviewId && review.user.toString() === userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review
    product.reviews.splice(reviewIndex, 1);
    await product.save();

    res.status(200).json({
      message: "Review deleted successfully",
      averageRating: product.calculateAverageRating(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product and populate user details for reviews
    const product = await Product.findById(productId).populate(
      "reviews.user",
      "firstName lastName email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      reviews: product.reviews,
      averageRating: product.calculateAverageRating(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
