import {asyncHandler} from "../../utils/async-handler";
import {Review} from "./review.model";

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

  console.log(body)

  const data = await Review.create(body);

  res.send({success: true, data});
});