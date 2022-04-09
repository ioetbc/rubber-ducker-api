"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = async (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("no auth header");
        throw new Error("Not authenticated");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("no token");
        throw new Error("Not authenticated");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("payload bioth", payload);
        req.userId = payload.userId;
        next();
        return;
    }
    catch (error) { }
    throw new Error("Not authenticatedd");
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map