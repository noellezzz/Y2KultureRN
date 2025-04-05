import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { getLocalIP } from "./utils/getLocalIP.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
