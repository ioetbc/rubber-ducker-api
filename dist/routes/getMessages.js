"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const db_1 = require("../utils/db");
const getMessages = async (req, res) => {
    console.log("in the new function");
    const { userId, body } = req;
    if (!userId) {
        res.send({ user: null });
        return;
    }
    if (body.length < 1) {
        res.send("No filters");
        return;
    }
    const messages = await (0, db_1.findMessages)({
        github_id: userId,
        recipient_github_id: body.recipient_github_id,
    });
    res.send(messages);
    return;
};
exports.getMessages = getMessages;
//# sourceMappingURL=getMessages.js.map