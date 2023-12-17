import { Router } from "express";

import { router as v1 } from "./v1/v1.router";

export const router = Router();

router.use("/api/v1", v1);
