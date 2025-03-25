"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceRoutes = void 0;
var express_1 = __importDefault(require("express"));
var workspaceController_1 = require("../controllers/workspaceController");
var authMiddleware_1 = require("../middleware/authMiddleware");
exports.workspaceRoutes = express_1.default.Router();
exports.workspaceRoutes.post("/workspace/create", authMiddleware_1.protect, workspaceController_1.createWorkspace);
exports.workspaceRoutes.get("/workspace", authMiddleware_1.protect, workspaceController_1.getWorkspace);
exports.workspaceRoutes.get("/workspace/:workspaceId", authMiddleware_1.protect, workspaceController_1.getWorkspace);
exports.workspaceRoutes.delete("/workspace/:workspaceId", authMiddleware_1.protect, workspaceController_1.deleteWorkspace);
exports.workspaceRoutes.get("/workspaces", authMiddleware_1.protect, workspaceController_1.getAllWorkspace);
exports.workspaceRoutes.post("/workspace/:workspaceId/invite", authMiddleware_1.protect, workspaceController_1.inviteColleague);
exports.workspaceRoutes.post("/workspace/:workspaceId/response", authMiddleware_1.protect, workspaceController_1.inviteResponse);
