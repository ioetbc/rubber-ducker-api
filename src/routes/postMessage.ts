import { createMessage } from "../utils/db";

export const postMessage = async (req: any, res: any) => {
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

  const messages = await createMessage({
    github_id: userId,
    teacher_github_id: body.teacher_github_id,
    text: body.message,
  });

  res.send(messages);
  return;
};
