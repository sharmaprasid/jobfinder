import express from "express";
import { getCompanies } from "../controllers/companyController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getCompanies);

export default router;
