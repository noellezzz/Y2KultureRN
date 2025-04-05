import express from "express";
import {
  loginOrRegister,
  updateUser,
  getUserById,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/", loginOrRegister);
router.put("/:userId", updateUser);
router.get("/:userId", getUserById);

export default router;
