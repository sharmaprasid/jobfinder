// api/index.js
import app from "../app.js";
import { createServer } from "http";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    
    res.setHeader("Access-Control-Allow-Origin", "https://jobfinder-frontend-beta.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
    return;
  }

  const server = createServer(app);
  server.emit("request", req, res);
}
