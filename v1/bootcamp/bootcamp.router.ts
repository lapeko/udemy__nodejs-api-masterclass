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

export const router = Router();

router.route("/").get(getBootcamps).post(insertBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(putBootcamp)
  .patch(patchBootcamp);

router.route("/radius/:zipcode/:radius").get(getBootcampsByZipCodeAndDistance);
