import express from "express"; // Import Express to create routes.
import multer from "multer"; // Import multer for handling file uploads.
import path from "path"; // Path module to manage file paths.
import Product from "../models/Product"; // Import the Product model.
const router = express.Router(); // Create a router object.

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/add", upload.array("images", 5), async (req, res) => {
  try {

    const { id, title, description, price, quantity } = req.body;

    const images = req.files
      ? (req.files as Express.Multer.File[]).map((file) => file.path)
      : []; // If no files, default to an empty array

    // Create a new product document with the received data
    const product = new Product({
      id,
      title,
      description,
      price,
      images, // Store the image paths (or empty array if no images)
      quantity,
    });

    // Save the new product to the database
    await product.save();

    // Send a success response
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Handle known error types
    } else {
      res.status(500).json({ error: "An unexpected error occurred." }); // Handle unknown errors
    }
  }
});

// Fetch all products (no changes required for this route)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve all products from the database
    res.status(200).json(products); // Send the products as a JSON response
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message }); // Handle known error types
    } else {
      res.status(500).json({ error: "An unexpected error occurred." }); // Handle unknown errors
    }
  }
});

// Export the router so it can be used in the main app
export default router;
