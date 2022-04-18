import { createReview } from "../utils/db";

export const postReview = async (req: any, res: any) => {
  const { body, query } = req;

  if (!query.teacher_id) {
    res.send({ user: null });
    return;
  }
  console.log({
    review: body.message,
    stars: body.stars,
    teacher_id: query.teacher_id,
  });
  const reviews = await createReview({
    review: body.message,
    stars: body.stars,
    teacher_id: query.teacher_id,
  });

  res.send(reviews);
  return;
};
