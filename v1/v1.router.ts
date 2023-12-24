import { Router } from "express";

import { bootcampRouter } from "./bootcamp/bootcamp.router";
import { courseRouter } from "./course/course.router";

export const router = Router();

router.use("/bootcamp", bootcampRouter);
router.use("/course", courseRouter);
