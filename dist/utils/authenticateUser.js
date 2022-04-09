"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
require("dotenv-safe").config({
    allowEmptyValues: true,
});
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const db_1 = require("./db");
const authenticateUser = (app) => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.accessToken);
    });
    app.use(passport_1.default.initialize());
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
    }, async (_, __, profile, done) => {
        let user = await (0, db_1.findUser)({ github_id: profile.id });
        let userId = profile.id;
        if ((0, isEmpty_1.default)(user)) {
            const { username, id } = profile;
            await (0, db_1.createUser)({
                username,
                avatar_url: profile._json.avatar_url,
                github_id: id,
            });
        }
        done(null, {
            accessToken: jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, {
                expiresIn: "1y",
            }),
            refreshToken: "",
        });
    }));
    app.get("/auth/github", passport_1.default.authenticate("github", { session: false }));
    app.get("/auth/github/callback", passport_1.default.authenticate("github", { session: false }), function (req, res) {
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    });
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=authenticateUser.js.map