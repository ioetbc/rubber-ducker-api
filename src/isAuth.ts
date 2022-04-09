import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export type ReqWithUserId = Request<{}, any, any, {}> & { userId: number };

export const isAuth: RequestHandler<{}, any, any, {}> = async (
  req,
  _,
  next
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("no auth header");
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("no token");
    throw new Error("Not authenticated");
  }

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload bioth", payload);
    (req as any).userId = payload.userId;
    next();
    return;
  } catch (error) {}

  throw new Error("Not authenticatedd");
};
