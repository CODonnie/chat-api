"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFormat = void 0;
var logger_1 = __importDefault(require("./logger"));
var logFormat = function (condition, message) {
    if (condition === "warn")
        process.env.NODE_ENV === "test" ? null : logger_1.default.warn(message);
    if (condition === "info")
        process.env.NODE_ENV === "test" ? null : logger_1.default.info(message);
    if (condition === "error")
        process.env.NODE_ENV === "test" ? null : logger_1.default.error(message);
};
exports.logFormat = logFormat;
