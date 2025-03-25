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
exports.inviteResponse = exports.inviteColleague = exports.deleteWorkspace = exports.getAllWorkspace = exports.getWorkspace = exports.createWorkspace = void 0;
var allModels_1 = require("../models/allModels");
var logger_1 = __importDefault(require("../utils/logger"));
var emailService_1 = require("../utils/emailService");
//@desc - Workspace creation
//@route - POST/api/workspace/create
var createWorkspace = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, userId, workspace, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                name_1 = req.body.name;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("user doesn't exist");
                    res.status(404).json({ message: "user doesn't exist" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, new allModels_1.Workspace({
                        name: name_1,
                        owner: userId,
                        members: [{ user: userId, role: "admin" }],
                    })];
            case 1:
                workspace = _b.sent();
                return [4 /*yield*/, workspace.save()];
            case 2:
                _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("new workspace created - ".concat(workspace));
                res.status(200).json({ message: "workspace created successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("workspace creation error - ".concat(error_1));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createWorkspace = createWorkspace;
//@desc - Retrieve workspace
//@route - GET/api/workspace/:workspaceId
var getWorkspace = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceId, workspace, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                workspaceId = req.params.workspaceId;
                workspace = void 0;
                if (!!workspaceId) return [3 /*break*/, 2];
                return [4 /*yield*/, allModels_1.Workspace.find({})];
            case 1:
                workspace = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, allModels_1.Workspace.findById(workspaceId)];
            case 3:
                workspace = _a.sent();
                _a.label = 4;
            case 4:
                if (!workspace) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("workspace ".concat(workspaceId, " not found"));
                    res.status(404).json({ message: "workspace doesn't exist" });
                    return [2 /*return*/];
                }
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("workspace ".concat(workspaceId, " retrieved successfully"));
                res.status(200).json({ workspace: workspace });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error retrieving workspace - ".concat(error_2));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getWorkspace = getWorkspace;
//@desc - Retrieve all user workspace
//@route - GET/api/workspaces
var getAllWorkspace = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, workspaces, userWorkspaces, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId_1 = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, allModels_1.Workspace.find({})];
            case 1:
                workspaces = _b.sent();
                userWorkspaces = workspaces.filter(function (workspace) { return workspace.owner.toString() === userId_1; });
                res.status(200).json({ data: userWorkspaces });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error retrieving all workspace - ".concat(error_3));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllWorkspace = getAllWorkspace;
//@desc - Delete workspace
//@route - DELETE/api/workspace/:workspaceId
var deleteWorkspace = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceId, userId_2, workspace, isAdmin, error_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                workspaceId = req.params.workspaceId;
                userId_2 = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, allModels_1.Workspace.findById(workspaceId)];
            case 1:
                workspace = _c.sent();
                if (!workspace) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("workspace ".concat(workspaceId, " not found"));
                    res.status(404).json({ message: "workspace doesn't exist" });
                    return [2 /*return*/];
                }
                isAdmin = (_b = workspace.members) === null || _b === void 0 ? void 0 : _b.some(function (member) { var _a; return ((_a = member === null || member === void 0 ? void 0 : member.user) === null || _a === void 0 ? void 0 : _a.toString()) === userId_2 && (member === null || member === void 0 ? void 0 : member.role) === "admin"; });
                if (!isAdmin) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("Unauthorise user - ".concat(userId_2, " not admin"));
                    res.status(403).json({ message: "access denied" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, allModels_1.Workspace.findByIdAndDelete(workspaceId)];
            case 2:
                _c.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("workspace ".concat(workspaceId, " removed"));
                res.status(200).json({ message: "workspace deleted zuccessfully" });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _c.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error retrieving workspace - ".concat(error_4));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteWorkspace = deleteWorkspace;
//@desc - invite colleagues
//@rout - POST/api/workspace/:workspaceId/invite
var inviteColleague = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceId, email, userId_3, workspace, isAdmin, invitee_1, isMember, inviteLink, subject, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                workspaceId = req.params.workspaceId;
                email = req.body.email;
                userId_3 = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, allModels_1.Workspace.findById(workspaceId)];
            case 1:
                workspace = _b.sent();
                if (!workspace) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("workspace ".concat(workspaceId, " not found"));
                    res.status(404).json({ message: "workspace not found" });
                    return [2 /*return*/];
                }
                isAdmin = workspace.members.some(function (member) {
                    return member.user.toString() === userId_3.toString() && member.role === "admin";
                });
                if (!isAdmin) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("Unauthorise attempt: user ".concat(userId_3, " is not admin"));
                    res.status(403).json({ message: "access denied" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, allModels_1.User.findOne({ email: email })];
            case 2:
                invitee_1 = _b.sent();
                if (!invitee_1) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("User not found, can't invite");
                    res.status(404).json({ message: "user not found" });
                    return [2 /*return*/];
                }
                isMember = workspace.members.some(function (member) {
                    return member.user.toString() === invitee_1._id.toString();
                });
                if (isMember || workspace.pendingInvites.includes(email)) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("user ".concat(invitee_1._id, " is already a member or invited"));
                    res.status(400).json({ message: "user is a member or invited" });
                    return [2 /*return*/];
                }
                workspace.pendingInvites.push(email);
                return [4 /*yield*/, workspace.save()];
            case 3:
                _b.sent();
                inviteLink = "http://localhost:5430/api/workspace/workspaceId/join?email=".concat(email);
                subject = "You are invited to join ".concat(workspace.name, " workspace");
                return [4 /*yield*/, (0, emailService_1.sendEmail)(email, subject, inviteLink)];
            case 4:
                _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("user ".concat(invitee_1._id, " invited successfully"));
                res.status(200).json({ message: "user invited successfully", workspace: workspace });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error inviting user ".concat(error_5));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.inviteColleague = inviteColleague;
//@desc - pt invitation
//@route - POST/api/workspace/:workspaceId/accept
var inviteResponse = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var workspaceId, userId, user, inviteStatus, userEmail_1, workspace, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                workspaceId = req.params.workspaceId;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, allModels_1.User.findById(userId)];
            case 1:
                user = _b.sent();
                inviteStatus = req.body.inviteStatus;
                userEmail_1 = user.email;
                return [4 /*yield*/, allModels_1.Workspace.findById(workspaceId)];
            case 2:
                workspace = _b.sent();
                if (!workspace) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("workspace ".concat(workspaceId, " not found"));
                    res.status(404).json({ message: "workspace not found" });
                    return [2 /*return*/];
                }
                if (!workspace.pendingInvites.includes(userEmail_1)) {
                    process.env.NODE_ENV === "test"
                        ? null
                        : logger_1.default.warn("".concat(userEmail_1, " not invited to workspace ").concat(workspaceId));
                    res.status(400).json({ message: "user not invited" });
                    return [2 /*return*/];
                }
                console.log("".concat(inviteStatus));
                if (!(inviteStatus === "accept")) return [3 /*break*/, 4];
                workspace.members.push({ user: userId, role: "member" });
                workspace.pendingInvites = workspace.pendingInvites.filter(function (email) { return email !== userEmail_1; });
                console.log('e don enter accept block');
                return [4 /*yield*/, workspace.save()];
            case 3:
                _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("".concat(userEmail_1, " added to workspace ").concat(workspaceId));
                res.status(200).json({ message: "user added successfully", workspace: workspace });
                return [2 /*return*/];
            case 4:
                if (!(inviteStatus === "reject")) return [3 /*break*/, 6];
                workspace.pendingInvites = workspace.pendingInvites.filter(function (email) { return email !== userEmail_1; });
                console.log("e enter reject o");
                return [4 /*yield*/, workspace.save()];
            case 5:
                _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.info("".concat(userEmail_1, " rejected workspace ").concat(workspaceId, " invite"));
                res.status(200).json({ message: "invite rejected" });
                return [2 /*return*/];
            case 6:
                res.status(400).json({ message: "invalid invite status" });
                return [2 /*return*/];
            case 7:
                error_6 = _b.sent();
                process.env.NODE_ENV === "test"
                    ? null
                    : logger_1.default.error("error adding user - ".concat(error_6));
                res.status(500).json({ message: "an error occured" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.inviteResponse = inviteResponse;
