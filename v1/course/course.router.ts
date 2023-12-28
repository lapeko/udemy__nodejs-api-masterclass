import { Router } from "express";

import {
  getAllCourses,
  getCourseById,
  createCourseByBootcampId,
  patchCourse,
  deleteCourse,
} from "./course.controller";
import {auth} from "../../middleware/auth";

export const courseRouter = Router({ mergeParams: true });

courseRouter
  .route("/")
  .get(getAllCourses)
  .post(auth, createCourseByBootcampId);

courseRouter
  .route("/:id")
  .get(getCourseById)
  .patch(auth, patchCourse)
  .delete(auth, deleteCourse);
