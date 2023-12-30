import {asyncHandler} from "../../utils/async-handler";
import {ErrorResponse} from "../../utils/error-response";
import {Review} from "./review.model";

/*
 * @description:   Get reviews for user
 * @path:         /api/v1/user/:userId/userReviews
 * @method:        GET
 */
export const getAllReviewsByUser = asyncHandler(async (req, res) => {
  if (!req.params.userId)
    throw new ErrorResponse(400, "UserID not received");

  const data = await Review.find({user: req.params.userId}).populate({
    path: "user",
    select: "name email",
  });

  res.send({success: true, data});
});

/*
 * @description:   Get reviews for bootcamp
 * @path:         /api/v1/bootcamp/:bootcampId/bootcampReviews
 * @method:        GET
 */
export const getAllReviewsByBootcamp = asyncHandler(async (req, res) => {
  if (!req.params.bootcampId)
    throw new ErrorResponse(400, "BootcampID not received");

  const data = await Review.find({bootcamp: req.params.bootcampId}).populate({
    path: "bootcamp",
    select: "name description",
  });

  res.send({success: true, data});
});