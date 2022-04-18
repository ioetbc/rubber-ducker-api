"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = void 0;
const db_1 = require("../utils/db");
const getAllMessages = async (req, res) => {
    console.log("in the new GETALLMESSAGES function");
    const { userId, body } = req;
    if (!userId) {
        res.send({ user: null });
        return;
    }
    if (body.length < 1) {
        res.send("No filters");
        return;
    }
    const messages = await (0, db_1.findAllMessages)({
        github_id: userId,
    });
    console.log("gunna return these messages", messages);
    res.send(messages);
    return;
};
exports.getAllMessages = getAllMessages;
//# sourceMappingURL=getAllMessages.js.map