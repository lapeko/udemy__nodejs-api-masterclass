import {RequestHandler} from "express";
import {join} from "path";
import {writeFile} from "fs/promises";

import {Bootcamp} from "./bootcamp.model";
import {ErrorResponse} from "../../utils/error-response";
import {asyncHandler} from "../../utils/async-handler";
import {geocoder} from "../../utils/geocoder";
import {EnvVariable, getEnvVariable} from "../../utils/get-env-variable";
import {IUserDocument} from "../user/user.model";

/*
 * @description:   Gets all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = asyncHandler(async (req, res) => {
  res.json(res.locals.advancedResults);
});

/*
 * @description:   Gets all bootcamps in radius
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
 * @description:   Gets one bootcamp
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
 * @description:   Creates one new bootcamp
 * @path:          "/api/v1/bootcamp"
 * @method:        POST
 * private
 */
export const insertBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const user: IUserDocument = res.locals.user;
  if (user.role !== "admin") {
    const bootcamp = await Bootcamp.findOne({user: user._id});
    if (bootcamp)
      throw new ErrorResponse(400, "User already has a bootcamp");
  }
  const data = await Bootcamp.create({...req.body, user: user._id});
  res.json({ success: true, data });
});

/*
 * @description:   Deletes one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        DELETE
 * private
 */
export const deleteBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const bootcampToDelete = await Bootcamp.findById(req.params.id);
  if (!bootcampToDelete)
    throw new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`);
  if (bootcampToDelete.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
    throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to delete given bootcamp`);
  await bootcampToDelete.deleteOne();
  res.json({ success: true });
});

/*
 * @description:   Updates bootcamp's field(s)
 * @path:          "/api/v1/bootcamp"
 * @method:        PATCH
 */
export const patchBootcamp: RequestHandler = asyncHandler(async (req, res) => {
  const bootcampToUpdate = await Bootcamp.findById(req.params.id);

  if (!bootcampToUpdate)
    throw new ErrorResponse(404, `Bootcamp with id ${req.params.id} not found`);

  if (bootcampToUpdate.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
    throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to update given bootcamp`);

  Object.assign(bootcampToUpdate, req.body);

  const data = await bootcampToUpdate.save();

  res.json({ success: true, data });
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
  if (bootcamp.user.toString() !== res.locals.user._id.toString() && res.locals.user.role !== "admin")
    throw new ErrorResponse(401, `User with ID ${res.locals.user._id} is not authorized to upload logo forgiven bootcamp`);
  if (!file) throw new ErrorResponse(400, "Logo not provided");
  if (!file.mimetype.startsWith("image")) throw new ErrorResponse(400, "Provided logo file is not a picture");
  if (file.size > +getEnvVariable(EnvVariable.MAX_IMAGE_SIZE_KB) * 1024) throw new ErrorResponse(400, "Logo is too big");

  const filePath =  join(getEnvVariable(EnvVariable.PUBLIC_PATH), `${req.params.id}.${file.mimetype.split("/")[1]}`);

  await writeFile(filePath, file.buffer);

  Object.assign(bootcamp, {photo: filePath});
  await bootcamp.save();

  res.json({success: true, data: bootcamp});
});
