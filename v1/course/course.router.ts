import { Router } from "express";

import {
  getAllCourses,
  getCourseById,
  createCourseByBootcampId,
  patchCourse,
  deleteCourse, getBootcampCourses,
} from "./course.controller";
import {auth} from "../../middleware/auth";
import {useAdvancedResults} from "../../middleware/use-advanced-results";
import {Course} from "./course.model";

export const courseRouter = Router({ mergeParams: true });

courseRouter
  .route("/")
  .get(useAdvancedResults(Course, [{path: "bootcamp", select: "name description"}]), getAllCourses)
  .post(auth("publisher", "admin"), createCourseByBootcampId);

courseRouter
  .route("/:id")
  .get(getCourseById)
  .patch(auth("publisher", "admin"), patchCourse)
  .delete(auth("publisher", "admin"), deleteCourse);

courseRouter.get("/:bootcampId/bootcampCourses", getBootcampCourses);
