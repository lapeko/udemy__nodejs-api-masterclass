import { RequestHandler } from "express";
import { join } from "path";
import { writeFile } from "fs/promises";

import { Bootcamp } from "./bootcamp.model";
import { ErrorResponse } from "../../utils/error-response";
import { asyncHandler } from "../../utils/async-handler";
import { geocoder } from "../../utils/geocoder";
import { EnvVariable, getEnvVariable } from "../../utils/get-env-variable";

/*
 * @description:   Get all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = asyncHandler(async (req, res) => {
  res.json(res.locals.advancedResults);
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
  const result = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!result)
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

/*
 * @description:   Uploads bootcamp's logo
 * @path:          "/api/v1/bootcamp/:id/logo"
 * @method:        PUT
 */
export const uploadLogo: RequestHandler = asyncHandler(async (req, res) => {
  const file = req.file;

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) throw new ErrorResponse(404, "Bootcamp with given ID does not exist");
  if (!file) throw new ErrorResponse(400, "Logo not provided");
  if (!file.mimetype.startsWith("image")) throw new ErrorResponse(400, "Provided logo file is not a picture");
  if (file.size > +getEnvVariable(EnvVariable.MAX_IMAGE_SIZE_KB) * 1024) throw new ErrorResponse(400, "Logo is too big");

  const filePath =  join(getEnvVariable(EnvVariable.PUBLIC_PATH), `${req.params.id}.${file.mimetype.split("/")[1]}`);

  await writeFile(filePath, file.buffer);

  Object.assign(bootcamp, {photo: filePath});
  await bootcamp.save();

  res.json({success: true, data: bootcamp});
});
