"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postReview = void 0;
const db_1 = require("../utils/db");
const postReview = async (req, res) => {
    const { body, query } = req;
    if (!query.teacher_id) {
        res.send({ user: null });
        return;
    }
    console.log({
        review: body.message,
        stars: body.stars,
        teacher_id: query.teacher_id,
    });
    const reviews = await (0, db_1.createReview)({
        review: body.message,
        stars: body.stars,
        teacher_id: query.teacher_id,
    });
    res.send(reviews);
    return;
};
exports.postReview = postReview;
//# sourceMappingURL=postReview.js.map