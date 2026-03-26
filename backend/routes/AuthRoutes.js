import express from "express";
import passport from "passport";
import { signup, login , logout , getProfile , googleCallback} from "../controllers/AuthController.js";
import { protect } from "../middlewares/aurhMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile",protect, getProfile);
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }),googleCallback);
export default router;