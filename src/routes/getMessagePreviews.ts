import { findAllMessages } from "../utils/db";

export const getMessagePreviews = async (req: any, res: any) => {
  const { userId, body } = req;
  if (!userId) {
    res.send({ user: null });
    return;
  }

  if (body.length < 1) {
    res.send("No filters");
    return;
  }

  const messages = await findAllMessages({
    github_id: userId,
  });

  console.log("gunna return these messages", messages);

  res.send(messages);
  return;
};
