import {CookieOptions, RequestHandler, Response} from "express";
import crypto from "crypto";

import {asyncHandler} from "../../utils/async-handler";
import {IUserDocument, User} from "./user.model";
import {ErrorResponse} from "../../utils/error-response";
import {EnvVariable, getEnvVariable} from "../../utils/get-env-variable";
import {sendEmail} from "../../utils/send-email";

const PRODUCTION_MODE = getEnvVariable(EnvVariable.NODE_ENV) === "production";
const PORT = getEnvVariable(EnvVariable.PORT);

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

  const user = await User.findOne({email}).select("+password");

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
export const whoAmI: RequestHandler = asyncHandler((_, res) => {
  res.json({success: true, data: res.locals.user});
});

/*
 * @description:   Reset password step one
 * @path:          "/api/v1/user/reset-password"
 * @method:        POST
 */
export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const email = req.body.email;
  if (!email)
    throw new ErrorResponse(400, "Email not provided");

  const user = await User.findOne({email});

  if (!user)
    throw new ErrorResponse(404, `User with email ${email} does not exist`);

  const token = user.resetPassword();

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Request to change password",
    html: `<p>You received this email because there was a request to change your password.</p>
        <p>If it was not you just ignore this message.</p>
        <p>If you want to proceed to change your password, click the link bellow</p>
        <br></br>
        <a href="${req.protocol}://${req.hostname}:${PORT}/api/v1/user/confirm-reset-password/${token}">Reset password</a>
    `,
  });

  res.json({success: true});
});

/*
 * @description:   Reset password step 2
 * @path:          "/api/v1/user/confirm-reset-password/:token"
 * @method:        GET
 */
export const confirmResetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const token = req.params.token;

  if (!token)
    return sendResetPasswordResponse(400, "Reset password failure. Token was not provided", res);

  const user = await User.findOne({
    resetPasswordToken: crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"),
    resetPasswordExpire: {$gte: Date.now()},
  });

  if (!user)
    return sendResetPasswordResponse(400, "Reset password failure. Token is invalid or expired", res);

  user.password = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await sendEmail({
    to: user.email,
    subject: "Request to change password",
    html: `
        <h1>Password was successfully reset</h1>
        <p>Your temporary password is: ${user.password}</p>
    `,
  });

  await user.save();

  sendResetPasswordResponse(200, "New password was successfully created and sent to your email", res);
});

/*
 * @description:   Change password
 * @path:          "/api/v1/user/change-password
 * @method:        POST
 */
export const changePassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  const user: IUserDocument = await User.findById(res.locals.user._id).select("+password");

  const passwordCorrect = await user.checkPassword(oldPassword);

  if (!passwordCorrect)
    throw new ErrorResponse(400, "Incorrect old password");

  user.password = newPassword;
  await user.save();

  sendResWithToken(user, res);
});

/*
 * @description:   Change details
 * @path:          "/api/v1/user/change-details
 * @method:        PATCH
 * private
 */
export const changeDetails: RequestHandler = asyncHandler(async (req, res) => {
  const {name, email} = req.body;
  const user: IUserDocument = res.locals.user;

  if (name != null) user.name = name;
  if (email != null) user.email = email;

  await user.save();

  res.json({success: true, data: user});
});

/*
 * @description:   Get all user
 * @path:          "/api/v1/user
 * @method:        GET
 * admin
 */
export const getUsers: RequestHandler = asyncHandler(async (_, res) => {
  res.json({success: true, data: res.locals.advancedResults});
});

/*
 * @description:   Get user by id
 * @path:          "/api/v1/user/:id
 * @method:        GET
 * admin
 */
export const getUserById: RequestHandler = asyncHandler(async (req, res) => {
  const data = await User.findById(req.params.id);
  res.json({success: true, data});
});

/*
 * @description:   Delete user
 * @path:          "/api/v1/user/:id
 * @method:        DELETE
 * admin
 */
export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({success: true});
});

/*
 * @description:   Update user
 * @path:          "/api/v1/user/:id
 * @method:        PATCH
 * admin
 */
export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const data = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
  res.json({success: true, data});
});

const sendResWithToken = <T>(user: IUserDocument, res: Response): void => {
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


const sendResetPasswordResponse = (status: number, message: string, res: Response): void => {
  res.status(status).contentType("text/html").send(`
    <h1>Reset password</h1>
    <p>${message}</p>
  `);
}