import { Router } from "express";

import { router as bootcampRouter } from "./bootcamp/bootcamp.router";

export const router = Router();

router.use("/bootcamp", bootcampRouter);
