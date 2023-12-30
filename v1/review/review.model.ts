import mongoose, {Document} from "mongoose";

import {ErrorResponse} from "../../utils/error-response";
import {Bootcamp} from "../bootcamp/bootcamp.model";

interface IReviewDocument extends Document {
  title: string;
  text: string;
  rating: number;
  user: mongoose.Types.ObjectId;
  bootcamp: mongoose.Types.ObjectId;
}

interface IReviewModel extends mongoose.Model<IReviewDocument> {
  updateAverageRating: (bootcampId: mongoose.Types.ObjectId) => void;
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
    const [response] = await Review.aggregate([
      { $match: { bootcamp: bootcampId } },
      { $group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } } },
    ]);

    if (!response)
      throw new ErrorResponse(500, `Bootcamp aggregation error. Bootcamp with ID ${bootcampId} not found`);

    const bootcamp = await Bootcamp.findById(bootcampId.toString());

    if (bootcamp) {
      Object.assign(bootcamp, {averageRating: Math.ceil(response.averageRating * 100) / 100});
      await bootcamp.save();
    }
  }
);

ReviewSchema.pre("save", function () {
  if (this.isModified("rating"))
    Review.updateAverageRating(this.bootcamp);
});

ReviewSchema.post("findOneAndDelete", function (doc) {
  Review.updateAverageRating(doc.bootcamp._id);
});

export const Review = mongoose.model<IReviewDocument, IReviewModel>("Review", ReviewSchema);