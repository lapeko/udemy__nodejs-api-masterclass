import mongoose, {Document} from "mongoose";

import {ErrorResponse} from "../../utils/error-response";
import {Bootcamp} from "../bootcamp/bootcamp.model";
import {Course} from "../course/course.model";

interface IReviewDocument extends Document {
  title: string;
  description: string;
  rating: number;
}

interface IReviewModel extends mongoose.Model<IReviewDocument> {
  updateAverageRating: (rating: IReviewModel) => void;
}

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: 100,
    required: true,
  },
  text: {
    type: String,
    trim: true,
    minLength: 6,
    maxLength: 1000,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  }
});

ReviewSchema.static(
  "updateAverageRating",
  async function (bootcampId: mongoose.Types.ObjectId) {
    const [response] = await Course.aggregate([
      { $match: { bootcamp: bootcampId } },
      { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } },
    ]);

    if (!response)
      throw new ErrorResponse(
        500,
        `Bootcamp aggregation error. Bootcamp with ID ${bootcampId} not found`
      );

    const bootcamp = await Bootcamp.findOne({ _id: bootcampId });
    if (bootcamp) {
      Object.assign(bootcamp, {averageCost: Math.ceil(response.averageCost / 10) * 10});
      await bootcamp.save();
    }
  }
);

// ReviewSchema.post("save")

export const Review = mongoose.model<IReviewDocument, IReviewModel>("Review", ReviewSchema);