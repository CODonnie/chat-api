"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
var notFound = function (req, res, next) {
    res.status(404).json({ message: "Resources not found - ".concat(req.originalUrl) });
};
exports.notFound = notFound;
var errorHandler = function (err, req, res, next) {
    var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    var message = err.message;
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "no resources found";
    }
    else if (err.name === "ValidationError") {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};
exports.errorHandler = errorHandler;
