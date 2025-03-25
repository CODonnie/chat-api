"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = exports.Logout = exports.Login = exports.Signup = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var allModels_1 = require("../models/allModels");
var logger_1 = __importDefault(require("../utils/logger"));
//@desc - Sign up users
//@route - POST/api/auth/register
var Signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, role, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password, role = _a.role;
                return [4 /*yield*/, allModels_1.User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (user) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("user ".concat(user.id, " already exist"));
                    res.status(401).json({ message: "user already exist" });
                    return [2 /*return*/];
                }
                user = new allModels_1.User({ name: name_1, email: email, password: password, role: role });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("user ".concat(user.id, " created successfully"));
                res.status(201).json({ message: "user created" });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("Signup error - ".concat(error_1));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.Signup = Signup;
//@desc - Login users
//@route - POST/api/auth/Login
var Login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, secret, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, allModels_1.User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("User doesn't exists");
                    res.status(401).json({ message: "user doesn't exist" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("user entered incorrect password");
                    res.status(403).json({ message: "invalid/missing credentials" });
                    return [2 /*return*/];
                }
                secret = process.env.JWT_SECRET;
                token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, secret, {
                    expiresIn: "1h",
                });
                res.cookie("chatApiToken", token, {
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1 * 24 * 1200 * 1000,
                });
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("user ".concat(user.id, " login successfully"));
                res.status(200).json({ message: "login successful", data: user });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.warn("login error - ".concat(error_2));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.Login = Login;
//@desc - Logout users
//@route - GET/api/auth/Logout
var Logout = function (req, res) {
    try {
        res.clearCookie("chatApiToken");
        process.env.NODE_ENV === "test" ? null : logger_1.default.info("user logged out");
        res.status(200).json({ messafe: "user logged out" });
    }
    catch (error) {
        process.env.NODE_ENV === "test"
            ? null
            : logger_1.default.error("error logging user our - ".concat(error));
        res.status(500).json({ message: "an error occured" });
    }
};
exports.Logout = Logout;
//@desc - protectee route for Auth testing
//@route - GET/api/auth/profile
var UserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, allModels_1.User.find({})];
            case 1:
                user = _a.sent();
                if (!user) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("User doesn't exists");
                    res.status(401).json({ message: "user doesn't exist" });
                    return [2 /*return*/];
                }
                res.status(200).json({ Users: user });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error logging user our - ".concat(error_3));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.UserProfile = UserProfile;
