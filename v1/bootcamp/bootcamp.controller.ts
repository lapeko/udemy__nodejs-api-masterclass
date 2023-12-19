import { RequestHandler } from "express";

import { Bootcamp } from "./bootcamp.model";
import { ErrorResponse } from "../../utils/error-response";

/*
 * @description:   Get all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = async (req, res, next) => {
  try {
    const data = await Bootcamp.find();
    res.json({ success: true, data });
  } catch (e) {
    next(new ErrorResponse());
  }
};

/*
 * @description:   Get one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        GET
 */
export const getBootcamp: RequestHandler = async (req, res, next) => {
  try {
    const data = await Bootcamp.findById(req.params.id);
    if (!data) {
      next(
        new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`)
      );
    }
    res.json({ success: true, data });
  } catch (e) {
    next(new ErrorResponse());
  }
};

/*
 * @description:   Create one new bootcamp
 * @path:          "/api/v1/bootcamp"
 * @method:        POST
 */
export const insertBootcamp: RequestHandler = async (req, res, next) => {
  try {
    const data = await Bootcamp.create(req.body);
    res.json({ success: true, data });
  } catch (e) {
    next(new ErrorResponse());
  }
};

/*
 * @description:   Delete one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        DELETE
 */
export const deleteBootcamp: RequestHandler = async (req, res, next) => {
  try {
    const result = await Bootcamp.deleteOne({ _id: req.params.id });
    if (!result.deletedCount)
      next(
        new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`)
      );
    res.json({ success: true });
  } catch (e) {
    next(new ErrorResponse());
  }
};

/*
 * @description:   Insert a bootcamp or replace if exist
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        PUT
 */
export const putBootcamp: RequestHandler = async (req, res, next) => {
  try {
    const options = { upsert: true, new: true, runValidators: true };
    const data = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      options
    );
    res.json({ success: true, data: data });
  } catch (e) {
    next(new ErrorResponse());
  }
};

/*
 * @description:   Update bootcamp's field(s)
 * @path:          "/api/v1/bootcamp"
 * @method:        PATCH
 */
export const patchBootcamp: RequestHandler = async (req, res, next) => {
  try {
    const options = { new: true, runValidators: true };
    const data = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      options
    );
    if (!data)
      next(
        new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`)
      );
    res.json({ success: true, data: data });
  } catch (e) {
    next(new ErrorResponse());
  }
};
