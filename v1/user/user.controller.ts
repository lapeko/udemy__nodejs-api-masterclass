import {RequestHandler} from "express";

import {asyncHandler} from "../../utils/async-handler";
import {User} from "./user.model";

/*
 * @description:   Register user
 * @path:          "/api/v1/user"
 * @method:        POST
 */
export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});