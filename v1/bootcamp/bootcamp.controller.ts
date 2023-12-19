import { RequestHandler } from "express";

import { Bootcamp } from "./bootcamp.model";
import { ErrorResponse } from "../../utils/error-response";
import { asyncHandler } from "../../utils/async-handler";

/*
 * @description:   Get all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = asyncHandler(async (_, res) => {
  const data = await Bootcamp.find();
  res.json({ success: true, data });
});

/*
 * @description:   Get one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        GET
 */
export const getBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const data = await Bootcamp.findById(req.params.id);
  if (!data)
    throw new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`);
  res.json({ success: true, data });
});

/*
 * @description:   Create one new bootcamp
 * @path:          "/api/v1/bootcamp"
 * @method:        POST
 */
export const insertBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const data = await Bootcamp.create(req.body);
  res.json({ success: true, data });
});

/*
 * @description:   Delete one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        DELETE
 */
export const deleteBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const result = await Bootcamp.deleteOne({ _id: req.params.id });
  if (!result.deletedCount)
    throw new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`);
  res.json({ success: true });
});

/*
 * @description:   Insert a bootcamp or replace if exist
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        PUT
 */
export const putBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const options = { upsert: true, new: true, runValidators: true };
  const data = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    options
  );
  res.json({ success: true, data: data });
});

/*
 * @description:   Update bootcamp's field(s)
 * @path:          "/api/v1/bootcamp"
 * @method:        PATCH
 */
export const patchBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const options = { new: true, runValidators: true };
  const data = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    options
  );
  if (!data)
    throw new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`);
  res.json({ success: true, data: data });
});
