"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeachers = void 0;
const db_1 = require("../utils/db");
const getTeachers = async (req, res) => {
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
    const teachers = await (0, db_1.findTeachers)({
        github_id: userId,
        minStarRating: body.minStarRating,
        technologies: body.technologies,
        maxTeacherPrice: body.teacherPrice,
    });
    res.send(teachers);
    return;
};
exports.getTeachers = getTeachers;
//# sourceMappingURL=findTeachers.js.map