import { RequestHandler } from "express";

import { asyncHandler } from "../../utils/async-handler";
import { Course } from "./course.model";
import { ErrorResponse } from "../../utils/error-response";
import { Bootcamp } from "../bootcamp/bootcamp.model";

/*
 * @description:   Get all courses
 * @path:          /api/v1/course
 * @method:        GET
 */
export const getAllCourses: RequestHandler = asyncHandler(async (req, res) => {
  res.json(res.locals.advancedResults);
});

/*
 * @description:   Get bootcamp courses
 * @path:          /api/v1/bootcamp/:bootcampId/courses
 * @method:        GET
 */
export const getBootcampCourses: RequestHandler = asyncHandler(async (req, res) => {
  const courses = await Course.find({ bootcamp: req.params.bootcampId }).populate({
    path: "bootcamp",
    select: "name description",
  });

  res.json({ success: true, data: {courses, count: courses.length} });
});

/*
 * @description:   Get course by id
 * @path:          /api/v1/course/:id
 * @method:        GET
 */
export const getCourseById: RequestHandler = asyncHandler(async (req, res) => {
  const data = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!data)
    throw new ErrorResponse(404, `Course by id: ${req.params.id} not found`);

  res.json({ success: true, data });
});

/*
 * @description:   Create course for bootcamp
 * @path:          /api/v1/bootcamp/:bootcampId/courses
 * @method:        POST
 * private
 */
export const createCourseByBootcampId: RequestHandler = asyncHandler(
  async (req, res) => {
    const bootcampId = req.params.bootcampId;
    const body = { ...req.body };

    body.bootcamp = await Bootcamp.findById(bootcampId);
    body.user = res.locals.user;

    if (!body.bootcamp)
      throw new Error(`Bootcamp with ID ${bootcampId} not found`);

    if (body.bootcamp.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
      throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to create courses for bootcamp ${bootcampId}`);

    const data = await new Course(body).save();

    res.json({ success: true, data });
  }
);

/*
 * @description:   Patch a course
 * @path:          /api/v1/bootcamp/:id
 * @method:        PATCH
 * private
 */
export const patchCourse: RequestHandler = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);

  if (course)
    Object.assign(course, req.body);
  else if (!course)
    throw new ErrorResponse(404, `Course with id ${req.params.id} not found`);

  if (course.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
    throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to update given course`);

  const data = await course.save();

  res.json({ success: true, data });
});

/*
 * @description:   Delete a course
 * @path:          /api/v1/bootcamp/:id
 * @method:        DELETE
 * private
 */
export const deleteCourse: RequestHandler = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    throw new ErrorResponse(404, `Course with id ${req.params.id} not found`);

  if (course.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
    throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to delete given course`);

  res.json({ success: true });
});
