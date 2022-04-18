import { reviews } from "../utils/db";

export const getReviews = async (req: any, res: any) => {
  console.log("in the new get reviews finction");
  const { query } = req;
  if (!query.github_id) {
    res.send({ user: null });
    return;
  }

  const userReviews = await reviews({ github_id: query.github_id });

  res.send(userReviews);
  return;
};
