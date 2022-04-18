"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserLoggedIn = void 0;
const db_1 = require("../utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkUserLoggedIn = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.send({ user: null });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("no token");
        res.send({ user: null });
        return;
    }
    let userId;
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        userId = payload.userId;
    }
    catch (error) {
        res.send({ user: null });
        return;
    }
    if (!userId) {
        res.send({ user: null });
        return;
    }
    const user = await (0, db_1.findUser)({ github_id: userId });
    res.send({ user });
    return;
};
exports.checkUserLoggedIn = checkUserLoggedIn;
//# sourceMappingURL=checkUserLoggedIn.js.map