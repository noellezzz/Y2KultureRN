import express from "express";
import {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

// Get all reviews for a specific product
router.get("/product/:productId", getProductReviews);

// Add a review to a product
router.post("/:userId/product/:productId", addReview);

// Update a specific review
router.put("/:userId/product/:productId/review/:reviewId", updateReview);

// Delete a specific review
router.delete("/:userId/product/:productId/review/:reviewId", deleteReview);

export default router;
