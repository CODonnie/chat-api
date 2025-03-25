"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
var express_1 = require("express");
var messageController_1 = require("../controllers/messageController");
var authMiddleware_1 = require("../middleware/authMiddleware");
exports.messageRouter = (0, express_1.Router)();
exports.messageRouter.post("/", authMiddleware_1.protect, messageController_1.sendMessage);
exports.messageRouter.get("/:channelId", authMiddleware_1.protect, messageController_1.getMessages);
