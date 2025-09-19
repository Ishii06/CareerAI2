import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";   // MongoDB connection
import authRoutes from "./routes/AuthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import progressRoute from "./routes/progressRoute.js";
import courseRoute from "./routes/courseRoute.js";
import cookieParser from "cookie-parser";
import internshipRoute from "./routes/internshipRoute.js";
import passport from "./config/passport.js";
import hackathonRoute from "./routes/hackathonRoute.js";
import resumeRoute from "./routes/resumeRoutes.js";
// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Connect Database
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoute);
app.use("/api/courses", courseRoute);
app.use("/api/internships", internshipRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/hackathons", hackathonRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});