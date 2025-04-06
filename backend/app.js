import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;
