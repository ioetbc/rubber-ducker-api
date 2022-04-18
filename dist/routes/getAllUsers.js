"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const db_1 = require("../utils/db");
const getAllUsers = async (_, res) => {
    const users = await (0, db_1.findAllUsers)();
    res.send(users);
    return;
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=getAllUsers.js.map