import mongoose from "mongoose";
import { Bootcamp } from "../bootcamp/bootcamp.model";

interface ICourseDocument extends mongoose.Document {
  title: string;
  description: string;
  weeks: number;
  tuition: number;
  minimumSkill: string;
  scholarhipsAvailable: boolean;
  bootcamp: mongoose.Types.ObjectId | null | undefined;
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
    },
  },
  { timestamps: true }
);

courseSchema.static(
  "updateAverageCost",
  async function (bootcampId: mongoose.Types.ObjectId | null | undefined) {
    const [{ averageCost }] = await Course.aggregate([
      { $match: { bootcamp: bootcampId } },
      { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } },
    ]);
    const bootcamp = await Bootcamp.findOne({ _id: bootcampId });
    if (bootcamp) {
      Object.assign(bootcamp, {
        averageCost: Math.ceil(averageCost / 10) * 10,
      });
      await bootcamp.save();
    }
  }
);

courseSchema.post("save", async function () {
  Course.updateAverageCost(this.bootcamp);
});
courseSchema.post("deleteOne", async function () {
  console.log((this as any)._conditions);
  // console.log(arguments);
  // Course.updateAverageCost(this);
});

export const Course = mongoose.model<ICourseDocument, ICourseModel>(
  "Course",
  courseSchema
);
