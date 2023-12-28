import {RequestHandler} from "express";

import {asyncHandler} from "../../utils/async-handler";

/*
 * @description:   Register user
 * @path:          "/api/v1/user"
 * @method:        POST
 */
export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  res.send("Ok");
});