import "reflect-metadata";
import express from "express";

import { authenticateUser } from "./utils/authenticateUser";
import { checkUserLoggedIn } from "./routes/checkUserLoggedIn";
import { getTeachers } from "./routes/findTeachers";
import { postReview } from "./routes/postReview";
import { ammendProfile } from "./routes/ammendProfile";
import { getReviews } from "./routes/getReviews";
import { getAllUsers } from "./routes/getAllUsers";
import { getConversation } from "./routes/getConversation";
import { getMessagePreviews } from "./routes/getMessagePreviews";
import { postMessage } from "./routes/postMessage";
import { isAuth } from "./isAuth";

import cors from "cors";
const app = express();
const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const main = async () => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());

  console.log("what");
  authenticateUser(app);

  app.use("/checkUserLoggedIn", checkUserLoggedIn);
  app.use("/getTeachers", isAuth, getTeachers);
  app.use("/postReview", isAuth, postReview);
  app.use("/ammendProfile", isAuth, ammendProfile);
  app.use("/getReviews", isAuth, getReviews);
  app.use("/getAllUsers", isAuth, getAllUsers);
  app.use("/getConversation", isAuth, getConversation);
  app.use("/getMessagePreviews", isAuth, getMessagePreviews);
  app.use("/postMessage", isAuth, postMessage);

  io.use((socket: any, next: any) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
  });

  io.on("connection", (socket: any) => {
    // notify existing users
    socket.broadcast.emit("user connected", {
      userID: socket.id,
      username: socket.username,
      messages: [],
    });
    socket.on(
      "private message",
      ({ content, to }: { content: string; to: string }) => {
        console.log("got a private content", { content, to });
        socket.emit("private message", {
          content,
          from: socket.id,
        });
        // socket.to(to).emit("private message", {
        //   content,
        //   from: socket.id,
        // });
      }
    );
  });

  server.listen(process.env.PORT || 3002, () => {
    console.log("listening on port 3002");
  });
};

main();
