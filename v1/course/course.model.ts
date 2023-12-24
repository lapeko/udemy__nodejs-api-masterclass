import mongoose from "mongoose";

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

export const Course = mongoose.model("Course", courseSchema);
