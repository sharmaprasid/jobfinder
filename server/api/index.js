// api/index.js
import app from "../app.js";
import { createServer } from "http";

export default async function handler(req, res) {
  // CORS Headers for ALL requests
  res.setHeader("Access-Control-Allow-Origin", "https://jobfinder-frontend-beta.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // All other requests
  const server = createServer(app);
  server.emit("request", req, res);
}
