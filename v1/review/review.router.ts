import {Router} from "express";

import {auth} from "../../middleware/auth";
import {
  createReview, getAllReviews,
  getAllReviewsByBootcamp,
  getAllReviewsByUser,
  getReviewById,
} from "./review.controller";
import {useAdvancedResults} from "../../middleware/use-advanced-results";
import {Review} from "./review.model";

export const reviewRouter = Router({mergeParams: true});

reviewRouter.get("/", auth("admin"), useAdvancedResults(Review), getAllReviews);
reviewRouter.route("/:id")
  .get(getReviewById)

// deleteReviewById
// updateReviewById

reviewRouter.post("/:bootcampId", auth(), createReview);
reviewRouter.get("/:userId/user-reviews", getAllReviewsByUser);
reviewRouter.get("/:bootcampId/bootcamp-reviews", getAllReviewsByBootcamp);
