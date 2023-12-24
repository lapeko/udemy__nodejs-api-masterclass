import { RequestHandler } from "express";

import { Bootcamp } from "./bootcamp.model";
import { ErrorResponse } from "../../utils/error-response";
import { asyncHandler } from "../../utils/async-handler";
import { geocoder } from "../../utils/geocoder";

/*
 * @description:   Get all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = asyncHandler(async (req, res) => {
  const deleteKeys = ["select", "sort", "page", "limit"];

  const query = { ...req.query };
  deleteKeys.forEach((key) => {
    delete query[key];
  });

  const select = (req.query.select as string | undefined)?.replace(",", " ");
  const sort = req.query.sort
    ? JSON.parse(req.query.sort as string)
    : "-createdAt";
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;
  const skip = (page - 1) * limit;

  const request = Bootcamp.find(query);
  select && request.select(select);
  request.sort(sort);
  request.skip(skip);
  request.limit(limit);

  const data = await request;

  res.json({ success: true, data });
});

/*
 * @description:   Get all bootcamps in radius
 * @path:          "/api/v1/bootcamp/radius/:zipcode/:radius"
 * @method:        GET
 */
export const getBootcampsByZipCodeAndDistance: RequestHandler = asyncHandler(
  async (req, res) => {
    const { zipcode, radius } = req.params;

    const [location] = await geocoder.geocode({ zipcode });
    const radians = +radius / 6378.1;

    const data = await Bootcamp.find({
      location: {
        $geoWithin: {
          $centerSphere: [[location.latitude, location.longitude], radians],
        },
      },
    });
    res.json({ success: true, data });
  }
);

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
