import { Router } from "express";

import { bootcampRouter } from "./bootcamp/bootcamp.router";
import { courseRouter } from "./course/course.router";
import {userRouter} from "./user/user.router";

export const router = Router();

router.use("/bootcamp", bootcampRouter);
router.use("/course", courseRouter);
router.use("/user", userRouter);
