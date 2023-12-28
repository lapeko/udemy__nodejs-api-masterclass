import {RequestHandler, Response} from "express";

import {asyncHandler} from "../../utils/async-handler";
import {IUserDocument, User} from "./user.model";
import {ErrorResponse} from "../../utils/error-response";

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

function sendResWithToken <T>(user: IUserDocument, res: Response): void {
  const token = user.getJwtToken();
  res.json({success: true, token});
}