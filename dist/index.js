"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = require("./utils/authenticateUser");
const db_1 = require("./utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const isAuth_1 = require("./isAuth");
const app = (0, express_1.default)();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
const main = async () => {
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    app.use(express_1.default.json());
    (0, authenticateUser_1.authenticateUser)(app);
    app.get("/me", async (req, res) => {
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
    });
    app.post("/findTeachers", isAuth_1.isAuth, async (req, res) => {
        const { userId, body } = req;
        if (!userId) {
            res.send({ user: null });
            return;
        }
        if (body.length < 1) {
            res.send("No filters");
            return;
        }
        const users = await (0, db_1.findTeachers)({
            github_id: userId,
            minStarRating: body.minStarRating,
            technologies: body.technologies,
            maxTeacherPrice: body.teacherPrice,
        });
        res.send(users);
        return;
    });
    app.post("/createReview", isAuth_1.isAuth, async (req, res) => {
        const { body, query } = req;
        if (!query.teacher_id) {
            res.send({ user: null });
            return;
        }
        const reviews = await (0, db_1.createReview)({
            review: body.review,
            stars: body.stars,
            teacher_id: query.teacher_id,
        });
        res.send(reviews);
        return;
    });
    app.put("/updateProfile", isAuth_1.isAuth, async (req, res) => {
        const { userId, body } = req;
        if (!userId) {
            res.send({ user: null });
            return;
        }
        const users = await (0, db_1.updateUser)({ body, github_id: userId });
        res.send(users);
        return;
    });
    app.get("/reviews", isAuth_1.isAuth, async (req, res) => {
        const { query } = req;
        if (!query.github_id) {
            res.send({ user: null });
            return;
        }
        const userReviews = await (0, db_1.reviews)({ github_id: query.github_id });
        res.send(userReviews);
        return;
    });
    app.get("/", (_, res) => {
        res.send("BOOOOM");
    });
    io.on("connection", (socket) => {
        socket.on("join-room", (room) => {
            console.log("joing room", room);
            socket.join(room);
        });
        socket.on("private-message", (message, room) => {
            socket.to(room).emit("recieve-message", message);
        });
    });
    server.listen(process.env.PORT || 3002, () => {
        console.log("listening on port 3002");
    });
};
main();
//# sourceMappingURL=index.js.map