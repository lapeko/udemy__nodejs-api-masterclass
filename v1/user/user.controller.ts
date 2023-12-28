import {CookieOptions, RequestHandler, Response} from "express";

import {asyncHandler} from "../../utils/async-handler";
import {IUserDocument, User} from "./user.model";
import {ErrorResponse} from "../../utils/error-response";
import {EnvVariable, getEnvVariable} from "../../utils/get-env-variable";

const PRODUCTION_MODE = getEnvVariable(EnvVariable.NODE_ENV) === "production";

/*
 * @description:   Register user
 * @path:          "/api/v1/user"
 * @method:        POST
 */
export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  sendResWithToken(user, res);
});

/*
 * @description:   Login user
 * @path:          "/api/v1/user/login"
 * @method:        POST
 */
export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password)
    throw new ErrorResponse(400, "Login or password not provided");

  const user = await User.findOne({email});

  if (!user)
    throw new ErrorResponse(400, "Incorrect credentials");

  const passwordCorrect = await user.checkPassword(password);

  if (!passwordCorrect)
    throw new ErrorResponse(400, "Incorrect credentials");

  sendResWithToken(user, res);
});

/*
 * @description:   Response with a user based on a token
 * @path:          "/api/v1/user/whoami"
 * @method:        GET
 */
export const whoAmI: RequestHandler = (req, res, next) => {
  res.json({success: true, data: res.locals.user});
};

function sendResWithToken <T>(user: IUserDocument, res: Response): void {
  const token = user.getJwtToken();

  const options: CookieOptions = {
    expires: new Date(Date.now() + +getEnvVariable(EnvVariable.COOKIE_EXPIRE_IN_DAYS) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: PRODUCTION_MODE,
  };

  res
    .cookie("token", token, options)
    .json({success: true, data: token});
}