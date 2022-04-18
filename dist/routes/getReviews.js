"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = void 0;
const db_1 = require("../utils/db");
const getReviews = async (req, res) => {
    console.log("in the new get reviews finction");
    const { query } = req;
    if (!query.github_id) {
        res.send({ user: null });
        return;
    }
    const userReviews = await (0, db_1.reviews)({ github_id: query.github_id });
    res.send(userReviews);
    return;
};
exports.getReviews = getReviews;
//# sourceMappingURL=getReviews.js.map