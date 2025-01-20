import mongoose, { Schema, Document } from "mongoose";

interface Product extends Document {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.model<Product>("Product", ProductSchema);
