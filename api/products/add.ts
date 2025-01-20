import multer from "multer";
import path from "path";
import { VercelRequest, VercelResponse } from "@vercel/node";
import Product from "../../src/models/Product"; // Adjust based on your file structure

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp/uploads/"); // Temporary directory for serverless environments
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadMiddleware = upload.array("images", 5); // Maximum of 5 images

// Middleware wrapper for serverless functions
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function runMiddleware(req: VercelRequest, res: VercelResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "POST") {
    try {
      // Run Multer middleware
      await runMiddleware(req, res, uploadMiddleware);

      const { id, title, description, price, quantity } = req.body;

      // Extract uploaded file paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const files = (req as any).files || [];
      const images = files.map((file: Express.Multer.File) => file.path);

      // Create a new product object
      const product = new Product({
        id,
        title,
        description,
        price,
        images,
        quantity,
      });

      // Save the product to the database
      await product.save();

      res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  } else if (req.method === "GET") {
    try {
      // Fetch all products
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
};
