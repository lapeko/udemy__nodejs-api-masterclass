import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import "@colors/colors";
import rateLimit from "express-rate-limit";
import cors from "cors";
const xss = require("xss-clean");

dotenv.config({ path: "./config/.env" });

import {router} from "./router";
import {connect} from "./config/db";
import {errorHandlerMiddleware} from "./middleware/error-handler";
import {EnvVariable, getEnvVariable} from "./utils/get-env-variable";

const PORT = getEnvVariable(EnvVariable.PORT) || 3000;
const NODE_ENV = getEnvVariable(EnvVariable.NODE_ENV);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 200,
});

const main = async () => {
  await connect();

  const app = express();

  NODE_ENV === "development" && app.use(morgan("dev"));

  app.use(cors());
  app.use(limiter);
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(xss());
  app.use(hpp());
  app.use(cookieParser());
  app.use(router);
  app.use(errorHandlerMiddleware);

  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} in mode ${NODE_ENV}`.green.bold));

  process.on("unhandledRejection", (error) => {
    if (error instanceof Error) console.error(error.message.red.bold);
    else if (typeof error === "string") console.error(error);
    else throw error;

    server.close(() => process.exit(1));
  });
};

main();
