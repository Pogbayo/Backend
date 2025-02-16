import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = ['https://d-market-3z4m.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.get("ping",(req,res)=>{
  res.send("pong")
})
app.listen(PORT, () => {
  console.log(`Server is running  ${PORT}`);
});
export default app;
