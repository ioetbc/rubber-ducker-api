"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ammendProfile = void 0;
const db_1 = require("../utils/db");
const ammendProfile = async (req, res) => {
    console.log("in the new ammendProfile");
    const { userId, body } = req;
    if (!userId) {
        res.send({ user: null });
        return;
    }
    const users = await (0, db_1.updateUser)({ body, github_id: userId });
    res.send(users);
    return;
};
exports.ammendProfile = ammendProfile;
//# sourceMappingURL=ammendProfile.js.map