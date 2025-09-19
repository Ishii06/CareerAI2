import express from "express";
import { generateResume } from "../controllers/resumeController.js";

const router = express.Router();

// POST → generate & download PDF
router.post("/generate", generateResume);

export default router;
