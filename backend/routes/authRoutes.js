import express from "express";
import {
  loginOrRegister,
  updateUser,
  getUserById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/orders", getAllOrders);

router.post("/", loginOrRegister);
router.put("/:userId", updateUser);
router.get("/:userId", getUserById);
router.put("/:userId/orders/:orderId/status", updateOrderStatus);

export default router;
