import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {inviteNotification} from "../controllers/notificationController";

export const notificationRouter = Router();

notificationRouter.get("/notification/workspace-invites", protect, inviteNotification);
