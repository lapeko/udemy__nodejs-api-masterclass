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
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

/*
 * @description:   Get one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        GET
 */
export const getBootcamp: RequestHandler = async (req, res) => {
  try {
    const data = await Bootcamp.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false });
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
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

/*
 * @description:   Delete one bootcamp
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        DELETE
 */
export const deleteBootcamp: RequestHandler = async (req, res) => {
  try {
    console.log(req.params.id);
    const result = await Bootcamp.deleteOne({ _id: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

/*
 * @description:   Insert a bootcamp or replace if exist
 * @path:          "/api/v1/bootcamp/:id"
 * @method:        PUT
 */
export const putBootcamp: RequestHandler = async (req, res) => {
  try {
    const options = { upsert: true, new: true, runValidators: true };
    const data = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      options
    );
    res.json({ success: true, data: data });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};

/*
 * @description:   Update bootcamp's field(s)
 * @path:          "/api/v1/bootcamp"
 * @method:        PATCH
 */
export const patchBootcamp: RequestHandler = async (req, res) => {
  try {
    const options = { new: true, runValidators: true };
    const data = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      options
    );
    if (!data) return res.status(404).json({ success: false });
    res.json({ success: true, data: data });
  } catch (e) {
    res.status(500).json({ success: false });
  }
};
