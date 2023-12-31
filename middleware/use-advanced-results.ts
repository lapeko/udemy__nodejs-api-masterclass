import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";

import { ErrorResponse } from "../utils/error-response";
import { asyncHandler } from "../utils/async-handler";

type UseAdvancedResults = <T extends Document>(model: Model<T>, populate?: Array<{ path: string, select?: string }>) => (req: Request, res: Response, next: NextFunction) => void;

export const useAdvancedResults: UseAdvancedResults = <T extends Document>(
  model: Model<T>,
  populate?: Array<{ path: string, select?: string }>
) => asyncHandler(async (req, res, next) => {
  const deleteKeys = ["select", "sort", "page", "limit"];

  let queryObj: Record<string, any> = {};
  Object.keys(req.query).forEach((key) => {
    if (!deleteKeys.includes(key) && key in model.schema.paths) {
      queryObj[key] = req.query[key];
    }
  });

  const count = await model.countDocuments();
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 0;

  if (page < 1 || page > Math.ceil(count / limit))
    throw new ErrorResponse(400, "Pagination page validation error");

  const select = (req.query.select as string | undefined)?.replace(",", " ");
  const sort = req.query.sort
    ? JSON.parse(req.query.sort as string)
    : "-createdAt";
  const skip = (page - 1) * limit;

  const request = model.find(queryObj);
  select && request.select(select);
  request.sort(sort);
  request.skip(skip);
  request.limit(limit);

  const pagination: {
    previous?: { page: number; limit: number };
    next?: { page: number; limit: number };
  } = {};

  if (limit < count) {
    if (page > 1) pagination.previous = { page: page - 1, limit };
    if (page < Math.ceil(count / limit))
      pagination.next = { page: page + 1, limit };
  }

  if (populate) request.populate(populate);

  const data = await request;

  res.locals.advancedResults = ({ success: true, data, count, pagination });
  next();
});