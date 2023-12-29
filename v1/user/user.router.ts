import {Router} from "express";

import {confirmResetPassword, createUser, loginUser, resetPassword, whoAmI} from "./user.controller";
import {auth} from "../../middleware/auth";

export const userRouter =  Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/whoami", auth(), whoAmI);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/confirm-reset-password/:token", confirmResetPassword);
