import { Router } from "express";

import {
  getBootcamps,
  getBootcamp,
  insertBootcamp,
  deleteBootcamp,
  putBootcamp,
  patchBootcamp,
  getBootcampsByZipCodeAndDistance,
} from "./bootcamp.controller";
import { courseRouter } from "../course/course.router";

export const bootcampRouter = Router();

bootcampRouter.use("/:bootcampId/courses", courseRouter);

bootcampRouter.route("/").get(getBootcamps).post(insertBootcamp);

bootcampRouter
  .route("/:id")
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(putBootcamp)
  .patch(patchBootcamp);

bootcampRouter
  .route("/radius/:zipcode/:radius")
  .get(getBootcampsByZipCodeAndDistance);
