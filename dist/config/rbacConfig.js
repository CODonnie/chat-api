"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var permittedActions = {
    admin: ["create", "read", "update", "delete"],
    moderator: ["create", "read"],
    user: ["read"]
};
exports.default = permittedActions;
