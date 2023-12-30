import mongoose, {Document} from "mongoose";

interface IReviewDocument extends Document {
  title: string;
  description: string;
  rating: number;
}

interface IReviewModel extends mongoose.Model<IReviewDocument> {
}

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: [100, "Title length is too long"],
    required: [true, "PLease, provide a title"],
  },
  text: {
    type: String,
    trim: true,
    minLength: [6, "Description should be at least 6 characters"],
    maxLength: [1000, "Description should have maximum 1000 characters"],
    required: [true, "Please provide description"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "PLease, provide your rating"],
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

export const Review = mongoose.model<IReviewDocument, IReviewModel>("Review", ReviewSchema);