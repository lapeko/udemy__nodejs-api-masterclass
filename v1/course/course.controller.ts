import { RequestHandler } from "express";

import { asyncHandler } from "./../../utils/async-handler";
import { Course } from "./course.model";

/*
 * @description:   Get all courses
 * @paths:         ["/api/v1/course", "/api/v1/course/:id"]
 * @method:        GET
 */
export const getAllCourses: RequestHandler = asyncHandler(async (req, res) => {
  const request = req.params.bootcampId
    ? Course.find({ bootcamp: req.params.bootcampId })
    : Course.find();

  const data = await request.populate({
    path: "bootcamp",
    select: "name description",
  });

  res.json({ success: true, data, count: data.length });
});
