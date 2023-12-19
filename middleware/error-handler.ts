import { ErrorRequestHandler } from "express";

export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err.stack.red);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ success: false, error: err.message });
};
