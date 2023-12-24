import { Router } from "express";

import { getAllCourses } from "./course.controller";

export const courseRouter = Router({ mergeParams: true });

courseRouter.route("/").get(getAllCourses);
courseRouter.route("/:bootcampId").get(getAllCourses);
