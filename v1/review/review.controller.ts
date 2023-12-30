import {asyncHandler} from "../../utils/async-handler";
import {Review} from "./review.model";
import {ErrorResponse} from "../../utils/error-response";

/*
 * @description:   Get reviews for user
 * @path:          /api/v1/user/:userId/userReviews
 * @method:        GET
 */
export const getAllReviewsByUser = asyncHandler(async (req, res) => {
  const data = await Review.find({user: req.params.userId});

  res.send({success: true, data});
});

/*
 * @description:   Get reviews for bootcamp
 * @path:          /api/v1/bootcamp/:bootcampId/bootcampReviews
 * @method:        GET
 */
export const getAllReviewsByBootcamp = asyncHandler(async (req, res) => {
  const data = await Review.find({bootcamp: req.params.bootcampId}).populate({
    path: "bootcamp",
    select: "name description",
  });

  res.send({success: true, data});
});

/*
 * @description:   Get review by ID
 * @path:          /api/v1/review/:id
 * @method:        GET
 */
export const getReviewById = asyncHandler(async (req, res) => {
  const data = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  res.send({success: true, data});
});

/*
 * @description:   Create review
 * @path:          /api/v1/review/:id
 * @method:        GET
 * authenticated
 */
export const createReview = asyncHandler(async (req, res) => {
  // res.locals.user;
  // req.params.courseId;
});