import { Router } from "express";
import {createChannel, deleteChannel, getChannels} from "../controllers/channelsController"
import { protect } from "../middleware/authMiddleware"

export const channelRouter = Router();

channelRouter.post("/create/:workspaceId", protect, createChannel);
channelRouter.get("/get/:workspaceId", protect, getChannels);
channelRouter.delete("/delete/:channelId", protect, deleteChannel);
