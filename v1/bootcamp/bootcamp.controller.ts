import { RequestHandler } from "express";

import { Bootcamp } from "./bootcamp.model";

/*
 * @description:   Get all bootcamps
 * @path:          "/api/v1/bootcamp"
 * @method:        GET
 */
export const getBootcamps: RequestHandler = async (req, res) => {
  try {
    const data = await Bootcamp.find();
    res.json({ error: null, success: true, data });
  } catch (e) {
    res.status(500).json({
      error: "Unexpected error occurred when request all bootcamps",
      success: false,
    });
  }
};

/*
 * @description:   Get one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        GET
 */
export const getBootcamp: RequestHandler = async (req, res) => {
  try {
    const data = await Bootcamp.findById(req.body.id);
    res.json({ error: null, success: true, data });
  } catch (e) {
    res.status(500).json({
      error: "Unexpected error occurred when request bootcamp",
      success: false,
    });
  }
};

/*
 * @description:   Create one new bootcamp
 * @path:          "/api/v1/bootcamp"
 * @method:        POST
 */
export const insertBootcamp: RequestHandler = async (req, res) => {
  try {
    const data = await Bootcamp.create(req.body);
    res.json({ error: null, success: true, data });
  } catch (e) {
    res
      .status(400)
      .json({ error: "Provided data is not correct", success: false });
  }
};

/*
 * @description:   Delete one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        DELETE
 */
export const deleteBootcamp: RequestHandler = (req, res) =>
  res.json({ error: null, success: true });

/*
 * @description:   Insert a bootcamp or replace if exist
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        PUT
 */
export const putBootcamp: RequestHandler = (req, res) =>
  res.json({ error: null, success: true });

/*
 * @description:   Update bootcamp's field(s)
 * @path:          "/api/v1/bootcamp"
 * @method:        PATCH
 */
export const patchBootcamp: RequestHandler = (req, res) =>
  res.json({ error: null, success: true });
