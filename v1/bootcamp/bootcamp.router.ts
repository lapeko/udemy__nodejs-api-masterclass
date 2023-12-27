import { Router } from "express";
import multer from "multer";

import {
  getBootcamps,
  getBootcamp,
  insertBootcamp,
  deleteBootcamp,
  putBootcamp,
  patchBootcamp,
  getBootcampsByZipCodeAndDistance,
  uploadLogo,
} from "./bootcamp.controller";
import {courseRouter} from "../course/course.router";

const upload = multer({ storage: multer.memoryStorage() });


export const bootcampRouter = Router();

bootcampRouter.use("/:bootcampId/courses", courseRouter);

bootcampRouter.route("/").get(getBootcamps).post(insertBootcamp);

bootcampRouter.route("/:id")
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(putBootcamp)
  .patch(patchBootcamp);

bootcampRouter.route("/:id/logo")
  .post(upload.single('file'), uploadLogo);

bootcampRouter.route("/radius/:zipcode/:radius")
  .get(getBootcampsByZipCodeAndDistance);
