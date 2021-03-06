import { findConversation } from "../utils/db";

export const getConversation = async (req: any, res: any) => {
  console.log("in the new function");
  const { userId, body } = req;
  if (!userId) {
    res.send({ user: null });
    return;
  }

  if (body.length < 1) {
    res.send("No filters");
    return;
  }

  const messages = await findConversation({
    github_id: userId,
    teacher_github_id: body.teacher_github_id,
  });

  res.send(messages);
  return;
};
