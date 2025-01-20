import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running `);
});
