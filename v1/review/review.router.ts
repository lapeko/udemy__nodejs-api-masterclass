import {Router} from "express";

import {auth} from "../../middleware/auth";
import {
  createReview,
  getAllReviewsByBootcamp,
  getAllReviewsByUser,
  getReviewById,
} from "./review.controller";

export const reviewRouter = Router({mergeParams: true});

reviewRouter.route("/:id")
  .get(getReviewById);

reviewRouter.post("/:courseId", auth(), createReview);


// getAllReviews
// getAllById
// deleteReviewById
// updateReviewById

// getAllByBootcamp
// createReviewByBootcamp

reviewRouter.get("/:userId/user-reviews", getAllReviewsByUser);
reviewRouter.get("/:bootcampId/bootcamp-reviews", getAllReviewsByBootcamp);
