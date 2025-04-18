import express from "express";
import multer from "multer";
import {
  uploadProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addPromotion,
} from "../controllers/productController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), uploadProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);
router.post("/promo/:id", addPromotion);

export default router;
