import User from "../../src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

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
        .status(200)
        .json({ message: "Login successful", token, isAdmin: user.isAdmin });
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
