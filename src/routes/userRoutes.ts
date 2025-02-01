import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";

const router = express.Router(); // Create a router object.

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body; // Extract details from the request body.

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
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
});

//Login route
router.post("/login", async (req: Request, res: Response) => {
  console.log(req.body)
  console.log("Login route hit"); // Check if the route is hit

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Inavlid email or password" });
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
      { expiresIn: "32h" },
    );

    res
      .status(200)
      .json({ message: "Login successful", token, isAdmin: user.isAdmin });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occured" });
    }
  }
});

// Fetch all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find(); // Find all users in the database.
    res.status(200).json(users); // Respond with the list of users.
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Handle errors with a known error type.
    } else {
      res.status(500).json({ error: "An unexpected error occurred." }); // Handle unexpected errors.
    }
  }
});

export default router; // Export the router so it can be used in the main app.
