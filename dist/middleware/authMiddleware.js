"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitted = exports.authorize = exports.protect = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var logger_1 = __importDefault(require("../utils/logger"));
var rbacConfig_1 = __importDefault(require("../config/rbacConfig"));
var protect = function (req, res, next) {
    var _a, _b;
    var token = req.cookies.chatApiToken || ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (token) {
        try {
            var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id, role: decoded.role };
            next();
        }
        catch (error) {
            logger_1.default.error("auth error - ".concat(error));
            res.status(500).json({ message: "an error occured" });
        }
    }
    else {
        logger_1.default.warn("Unauthorised user - no token provided");
        res.status(403).json({ message: "access denied" });
        return;
    }
};
exports.protect = protect;
var authorize = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        var _a, _b, _c;
        if (!req.user || !roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            logger_1.default.warn("Unauthorised access attempt by ".concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, " ").concat((_c = req.user) === null || _c === void 0 ? void 0 : _c.role));
            res.status(403).json({ message: "access denied" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
var permitted = function (action) {
    return function (req, res, next) {
        var _a, _b;
        var userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (rbacConfig_1.default[userRole].includes(action))
            next();
        logger_1.default.warn("Unauthorised action attempt from ".concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
        res.status(403).json({ message: "access denied" });
        return;
    };
};
exports.permitted = permitted;
