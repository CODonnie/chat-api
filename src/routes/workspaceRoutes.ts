import express from "express";
import { inviteResponse, createWorkspace, deleteWorkspace, getAllWorkspace, getWorkspace, inviteColleague } from "../controllers/workspaceController";
import { protect } from "../middleware/authMiddleware";

export const workspaceRoutes = express.Router();

workspaceRoutes.post("/workspace/create", protect, createWorkspace);
workspaceRoutes.get("/workspace", protect, getWorkspace);
workspaceRoutes.get("/workspace/:workspaceId", protect, getWorkspace);
workspaceRoutes.delete("/workspace/:workspaceId", protect, deleteWorkspace);
workspaceRoutes.get("/workspaces", protect, getAllWorkspace);
workspaceRoutes.post("/workspace/:workspaceId/invite", protect, inviteColleague);
workspaceRoutes.post("/workspace/:workspaceId/response", protect, inviteResponse);

