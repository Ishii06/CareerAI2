// routes/hackathonRoute.js
import express from "express";
import { scrapeHackathons } from "../controllers/hackathonController.js";

const router = express.Router();

// GET /api/hackathons
router.get("/", scrapeHackathons);

export default router;