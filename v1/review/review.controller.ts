import {asyncHandler} from "../../utils/async-handler";
import {Review} from "./review.model";
import {ErrorResponse} from "../../utils/error-response";

/*
 * @description:   Get all reviews
 * @path:          /api/v1/user/
 * @method:        GET
 * admin
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  res.send(res.locals.advancedResults);
});

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
 * @path:          /api/v1/review/:bootcampId
 * @method:        POST
 * authenticated
 */
export const createReview = asyncHandler(async (req, res) => {
  const body = req.body;
  body.user = res.locals.user._id;
  body.bootcamp = req.params.bootcampId;

  const data = await Review.create(body);

  res.send({success: true, data});
});

/*
 * @description:   Delete review by ID
 * @path:          /api/v1/review/:id
 * @method:        DELETE
 * authenticated
 */
export const deleteReviewById = asyncHandler(async (req, res) => {
  const user = res.locals.user;

  if (user._id !== req.params.id && user.role !== "admin")
    throw new ErrorResponse(401, "You not allowed to delete this review");

  const review = await Review.findById(req.params.id);

  if (!review)
    throw new ErrorResponse(404, "Review not found");

  await review.deleteOne();
  
  res.send({success: true});
});

/*
 * @description:   Update review by ID
 * @path:          /api/v1/review/:id
 * @method:        PATCH
 * authenticated
 */
export const updateReviewById = asyncHandler(async (req, res) => {
  const user = res.locals.user;
  if (user._id !== req.params.id && user.role !== "admin")
    throw new ErrorResponse(401, "You not allowed to update this review");

  const review = await Review.findById(req.params.id);

  if (!review)
    throw new ErrorResponse(404, `Review with ID: ${req.params.id} not found`);

  Object.assign(review, req.body);
  const data = await review.save();

  res.send({success: true, data});
});