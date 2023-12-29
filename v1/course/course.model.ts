import mongoose from "mongoose";
import { Bootcamp } from "../bootcamp/bootcamp.model";
import { ErrorResponse } from "../../utils/error-response";

interface ICourseDocument extends mongoose.Document {
  title: string;
  description: string;
  weeks: number;
  tuition: number;
  minimumSkill: string;
  scholarhipsAvailable: boolean;
  bootcamp: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  updatedAt: NativeDate;
  createdAt: NativeDate;
}

interface ICourseModel extends mongoose.Model<ICourseDocument> {
  updateAverageCost(
    bootcampId: mongoose.Types.ObjectId | null | undefined
  ): Promise<{ success: boolean }>;
}

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: [true, "Provide title"],
    },
    description: {
      type: String,
      require: [true, "Provide description"],
    },
    weeks: {
      type: Number,
      min: [1, "Weeks should be positive"],
      require: [true, "Provide weeks"],
    },
    tuition: {
      type: Number,
      min: [0, "Weeks should not be negative"],
      require: [true, "Provide tuition"],
    },
    minimumSkill: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      require: [true, "Provide minimumSkill"],
    },
    scholarhipsAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      require: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: true,
    }
  },
  { timestamps: true }
);

courseSchema.static(
  "updateAverageCost",
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

courseSchema.post("save", async function () {
  Course.updateAverageCost(this.bootcamp!._id);
});
courseSchema.post("findOneAndDelete", async function (doc) {
  Course.updateAverageCost(doc.bootcamp._id);
});

export const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  courseSchema
);
