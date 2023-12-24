import { RequestHandler } from "express";

import { asyncHandler } from "./../../utils/async-handler";
import { Course } from "./course.model";

export const getAllCourses: RequestHandler = asyncHandler(async (req, res) => {
  console.log(req.params);

  const request = req.params.bootcampId
    ? Course.find({ bootcamp: req.params.bootcampId })
    : Course.find();

  const data = await request;

  res.json({ success: true, data, count: data.length });
});
