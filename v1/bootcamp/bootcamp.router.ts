import { Router } from "express";
import multer from "multer";

import {
  getBootcamps,
  getBootcamp,
  insertBootcamp,
  deleteBootcamp,
  patchBootcamp,
  getBootcampsByZipCodeAndDistance,
  uploadLogo,
} from "./bootcamp.controller";
import {useAdvancedResults} from "../../middleware/use-advanced-results";
import {Bootcamp} from "./bootcamp.model";
import {auth} from "../../middleware/auth";

const upload = multer({ storage: multer.memoryStorage() });

export const bootcampRouter = Router();

bootcampRouter.route("/")
  .get(useAdvancedResults(Bootcamp, [{path: "courses", select: "title description"}]), getBootcamps)
  .post(auth("publisher", "admin"), insertBootcamp);

bootcampRouter.route("/:id")
  .get(getBootcamp)
  .delete(auth("publisher", "admin"), deleteBootcamp)
  .patch(auth("publisher", "admin"), patchBootcamp);

bootcampRouter.route("/:id/logo")
  .post(auth("publisher", "admin"), upload.single('file'), uploadLogo);

bootcampRouter.route("/radius/:zipcode/:radius")
  .get(getBootcampsByZipCodeAndDistance);

bootcampRouter.get("/:bootcampId/courses", (req, res) =>
  res.redirect(`/api/v1/course/${req.params.bootcampId}/bootcampCourses`));
bootcampRouter.get("/:bootcampId/reviews", (req, res) =>
  res.redirect(`/api/v1/review/${req.params.bootcampId}/bootcampReviews`));
