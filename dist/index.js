"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = require("./utils/authenticateUser");
const checkUserLoggedIn_1 = require("./routes/checkUserLoggedIn");
const findTeachers_1 = require("./routes/findTeachers");
const postReview_1 = require("./routes/postReview");
const ammendProfile_1 = require("./routes/ammendProfile");
const getReviews_1 = require("./routes/getReviews");
const getAllUsers_1 = require("./routes/getAllUsers");
const getConversation_1 = require("./routes/getConversation");
const getMessagePreviews_1 = require("./routes/getMessagePreviews");
const postMessage_1 = require("./routes/postMessage");
const isAuth_1 = require("./isAuth");
const cors_1 = __importDefault(require("cors"));
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
    console.log("what");
    (0, authenticateUser_1.authenticateUser)(app);
    app.use("/checkUserLoggedIn", checkUserLoggedIn_1.checkUserLoggedIn);
    app.use("/getTeachers", isAuth_1.isAuth, findTeachers_1.getTeachers);
    app.use("/postReview", isAuth_1.isAuth, postReview_1.postReview);
    app.use("/ammendProfile", isAuth_1.isAuth, ammendProfile_1.ammendProfile);
    app.use("/getReviews", isAuth_1.isAuth, getReviews_1.getReviews);
    app.use("/getAllUsers", isAuth_1.isAuth, getAllUsers_1.getAllUsers);
    app.use("/getConversation", isAuth_1.isAuth, getConversation_1.getConversation);
    app.use("/getMessagePreviews", isAuth_1.isAuth, getMessagePreviews_1.getMessagePreviews);
    app.use("/postMessage", isAuth_1.isAuth, postMessage_1.postMessage);
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        if (!username) {
            return next(new Error("invalid username"));
        }
        socket.username = username;
        next();
    });
    io.on("connection", (socket) => {
        socket.broadcast.emit("user connected", {
            userID: socket.id,
            username: socket.username,
            messages: [],
        });
        socket.on("private message", ({ content, to }) => {
            console.log("got a private content", { content, to });
            socket.emit("private message", {
                content,
                from: socket.id,
            });
        });
    });
    server.listen(process.env.PORT || 3002, () => {
        console.log("listening on port 3002");
    });
};
main();
//# sourceMappingURL=index.js.map