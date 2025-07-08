import express from "express";
import dbConnection  from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import companyRouter from "./routes/companyRoutes.js";

const app = express();

config({ path: "./config/config.env" });
 dbConnection();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // CLOUDINARY_CLIENT_NAME
  api_key: process.env.CLOUDINARY_API_KEY,       // CLOUDINARY_CLIENT_API
  api_secret: process.env.CLOUDINARY_API_SECRET, // CLOUDINARY_CLIENT_SECRET
});

app.use(
  cors({
    origin: 'https://jobfinder-frontend-beta.vercel.app', // Replace with your frontend URL
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/company", companyRouter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);


app.use(errorMiddleware);
export default app;
