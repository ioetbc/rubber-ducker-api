import { updateUser } from "../utils/db";

export const ammendProfile = async (req: any, res: any) => {
  console.log("in the new ammendProfile");
  const { userId, body } = req;

  if (!userId) {
    res.send({ user: null });
    return;
  }

  const users = await updateUser({ body, github_id: userId });

  res.send(users);
  return;
};
