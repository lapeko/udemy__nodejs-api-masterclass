import {Router} from "express";

import {createUser, loginUser, whoAmI} from "./user.controller";
import {auth} from "../../middleware/auth";

export const userRouter =  Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/whoami", auth, whoAmI);
