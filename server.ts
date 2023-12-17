import express from "express";
import dotenv from "dotenv";

import { router } from "./router";

dotenv.config({ path: "./config/.env" });

const PORT = process.env.PORT || 3000;

const app = express();

app.use(router);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} in mode ${process.env.NODE_ENV}`)
);
