import {Router} from "express";

import {auth} from "../../middleware/auth";
import {
  changePassword,
  confirmResetPassword,
  createUser,
  loginUser,
  resetPassword,
  whoAmI
} from "./user.controller";

export const userRouter =  Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/whoami", auth(), whoAmI);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/confirm-reset-password/:token", confirmResetPassword);
userRouter.post("/change-password", auth(), changePassword);
