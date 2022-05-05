"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const db_1 = require("../utils/db");
const postMessage = async (req, res) => {
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
    const messages = await (0, db_1.createMessage)({
        github_id: userId,
        teacher_github_id: body.teacher_github_id,
        text: body.message,
    });
    res.send(messages);
    return;
};
exports.postMessage = postMessage;
//# sourceMappingURL=postMessage.js.map