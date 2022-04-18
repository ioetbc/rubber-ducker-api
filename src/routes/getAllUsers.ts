import { findAllUsers } from "../utils/db";

export const getAllUsers = async (_: any, res: any) => {
  const users = await findAllUsers();

  res.send(users);
  return;
};
