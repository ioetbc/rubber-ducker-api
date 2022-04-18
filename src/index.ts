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
import { getAllMessages } from "./routes/getAllMessages";
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

  authenticateUser(app);

  app.use("/checkUserLoggedIn", checkUserLoggedIn);
  app.use("/getTeachers", isAuth, getTeachers);
  app.use("/postReview", isAuth, postReview);
  app.use("/ammendProfile", isAuth, ammendProfile);
  app.use("/getReviews", isAuth, getReviews);
  app.use("/getAllUsers", isAuth, getAllUsers);
  app.use("/getConversation", isAuth, getConversation);
  app.use("/getAllMessages", isAuth, getAllMessages);

  io.on("connection", (socket: any) => {
    socket.on("join-room", (room: string) => {
      console.log("joing room", room);
      socket.join(room);
    });

    socket.on("private-message", (message: string, room: string) => {
      console.log("private message recieved", message);
      socket.to(room).emit("recieve-message", message);
    });
  });

  server.listen(process.env.PORT || 3002, () => {
    console.log("listening on port 3002");
  });
};

main();
