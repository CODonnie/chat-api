import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messageController";
import { protect } from "../middleware/authMiddleware";

export const messageRouter = Router();

messageRouter.post("/", protect, sendMessage);
messageRouter.get("/:channelId", protect, getMessages);
