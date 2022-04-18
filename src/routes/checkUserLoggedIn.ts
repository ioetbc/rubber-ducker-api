import { findUser } from "../utils/db";
import jwt from "jsonwebtoken";

export const checkUserLoggedIn = async (req: any, res: any) => {
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
    const payload: any = jwt.verify(token, process.env.JWT_SECRET);
    userId = payload.userId;
  } catch (error) {
    res.send({ user: null });
    return;
  }

  if (!userId) {
    res.send({ user: null });
    return;
  }

  const user = await findUser({ github_id: userId });

  res.send({ user });
  return;
};
