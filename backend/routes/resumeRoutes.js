import express from "express";
import { generateResume } from "../controllers/resumeController.js";
import { protect } from "../middlewares/aurhMiddleware.js"; 

const router = express.Router();

// POST → generate & download PDF
router.post("/generate", protect, generateResume);

export default router;
