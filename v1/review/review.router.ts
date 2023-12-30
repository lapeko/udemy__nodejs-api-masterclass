import {Router} from "express";

import {auth} from "../../middleware/auth";
import {getAllReviewsByBootcamp, getAllReviewsByUser} from "./review.controller";
import {Review} from "./review.model";

export const reviewRouter = Router({mergeParams: true});

// reviewRouter.route("/")

// getAllReviews
// getAllById
// deleteReviewById
// updateReviewById

// getAllByBootcamp
// createReviewByBootcamp

reviewRouter.get("/:userId/userReviews", getAllReviewsByUser);
reviewRouter.get("/:bootcampId/bootcampReviews", getAllReviewsByBootcamp);
