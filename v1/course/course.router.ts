import { Router } from "express";

import {
  getAllCourses,
  getCourseById,
  createCourseByBootcampId,
  patchCourse,
  deleteCourse,
} from "./course.controller";

export const courseRouter = Router({ mergeParams: true });

courseRouter.route("/").get(getAllCourses).post(createCourseByBootcampId);
courseRouter
  .route("/:id")
  .get(getCourseById)
  .patch(patchCourse)
  .delete(deleteCourse);
