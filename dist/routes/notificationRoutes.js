"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
var express_1 = require("express");
var authMiddleware_1 = require("../middleware/authMiddleware");
var notificationController_1 = require("../controllers/notificationController");
exports.notificationRouter = (0, express_1.Router)();
exports.notificationRouter.get("/notification/workspace-invites", authMiddleware_1.protect, notificationController_1.inviteNotification);
