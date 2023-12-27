import {ErrorRequestHandler} from "express";
import {MulterError} from "multer";

import {ErrorResponse} from "../utils/error-response";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  let error: ErrorResponse = new ErrorResponse();

  if (err instanceof Error) error.message = err.message;

  if (err instanceof ErrorResponse) error = err;
  else if (err.name === "CastError")
    error = new ErrorResponse(400, `${err.reason}. Field: "${err.path}"`);
  else if (err.name === "ValidationError")
    error = new ErrorResponse(
      400,
      Object.values(err.errors)
        .map((e) => (e as any).properties.message)
        .join(", ")
    );
  else if (err.name === "MongoServerError" && err.code === 11000) {
    const entries = Object.entries(err.keyValue);
    error = new ErrorResponse(
      400,
      `Duplicated keys: ${entries
        .map(([key, value]) => `"${key}": "${value}"`)
        .join(", ")}`
    );
  } else if (err instanceof MulterError) {
    error.statusCode = 400;
    error.message = `File upload error: ${err.message}`;
  }

  res.status(error.statusCode).json({ success: false, error: error.message });
};
