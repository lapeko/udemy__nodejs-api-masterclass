import { Router } from "express";

import {
  getAllCourses,
  getCourseById,
  createCourseByBootcampId,
} from "./course.controller";

export const courseRouter = Router({ mergeParams: true });

courseRouter.route("/").get(getAllCourses).post(createCourseByBootcampId);
courseRouter.route("/:id").get(getCourseById);
