"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../controllers/authController");
var authMiddleware_1 = require("../middleware/authMiddleware");
var authRouter = express_1.default.Router();
authRouter.post("/register", authController_1.Signup);
authRouter.post("/login", authController_1.Login);
authRouter.get("/logout", authMiddleware_1.protect, authController_1.Logout);
authRouter.get("/profile", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("admin"), authController_1.UserProfile);
exports.default = authRouter;
