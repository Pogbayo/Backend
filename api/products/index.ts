import app from "../../src/index"; // Import your main Express app
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "http";

const server = createServer(app);

export default (req: VercelRequest, res: VercelResponse) => {
  server.emit("request", req, res);
};
