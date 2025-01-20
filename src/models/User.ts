import mongoose, { Schema, Document } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false },
  },
  { timestamps: true },
);

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
