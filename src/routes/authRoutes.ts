import express from "express";
import {Login, Logout, Signup, UserProfile} from "../controllers/authController";
import {authorize, protect} from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", Signup);
authRouter.post("/login", Login);
authRouter.get("/logout", protect, Logout);
authRouter.get("/profile", protect, authorize("admin"), UserProfile);

export default authRouter;
