import User from "../../src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
      });
      await user.save();

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        secret as string,
        { expiresIn: "1h" },
      );

      res
        .status(201)
        .json({
          message: "User registered successfully!",
          token,
          isAdmin: user.isAdmin,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
