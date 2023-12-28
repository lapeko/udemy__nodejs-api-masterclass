import {RequestHandler} from "express";
import jsonWebToken from "jsonwebtoken";

import {ErrorResponse} from "../utils/error-response";
import {EnvVariable, getEnvVariable} from "../utils/get-env-variable";
import {User} from "../v1/user/user.model";

const secretKey = getEnvVariable(EnvVariable.JWT_SECRET_KEY);

export const auth: RequestHandler = async (req, res, next) => {
  let token = "";
  const authorization = req.headers.authorization as string;

  if (req.cookies.token)
    token = req.cookies.token;
  else if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.split(" ").at(1) ?? "";
  };

  if (!token)
    return next(new ErrorResponse(400, "Not authorized"));

  if (!jsonWebToken.verify(token, secretKey))
    return next(new ErrorResponse(400, "Not authorized"));

  const {id} = jsonWebToken.decode(token) as {id: string} || {};

  if (!id)
    return next(new ErrorResponse(400, "Not authorized"));

  const user = await User.findById(id);

  if (!user)
    return next(new ErrorResponse(400, "Not authorized"));

  res.locals.user = user;
  next();
};
