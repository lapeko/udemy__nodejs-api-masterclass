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
import {useAdvancedResults} from "../../middleware/use-advanced-results";
import {Bootcamp} from "./bootcamp.model";
import {auth} from "../../middleware/auth";

const upload = multer({ storage: multer.memoryStorage() });
const advancedResults = useAdvancedResults(Bootcamp, [{path: "courses", select: "title description"}]);

export const bootcampRouter = Router();

bootcampRouter.use("/:bootcampId/courses", courseRouter);

bootcampRouter.route("/")
  .get(advancedResults, getBootcamps)
  .post(auth, insertBootcamp);

bootcampRouter.route("/:id")
  .get(getBootcamp)
  .delete(auth, deleteBootcamp)
  .put(auth, putBootcamp)
  .patch(auth, patchBootcamp);

bootcampRouter.route("/:id/logo")
  .post(auth, upload.single('file'), uploadLogo);

bootcampRouter.route("/radius/:zipcode/:radius")
  .get(getBootcampsByZipCodeAndDistance);
