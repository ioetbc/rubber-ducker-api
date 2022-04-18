import { findTeachers } from "../utils/db";

export const getTeachers = async (req: any, res: any) => {
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

  const teachers = await findTeachers({
    github_id: userId,
    minStarRating: body.minStarRating,
    technologies: body.technologies,
    maxTeacherPrice: body.teacherPrice,
  });

  res.send(teachers);
  return;
};
