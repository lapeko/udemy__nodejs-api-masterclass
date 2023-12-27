import express, {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import "@colors/colors";

dotenv.config({ path: "./config/.env" });

import {router} from "./router";
import {connect} from "./config/db";
import {errorHandlerMiddleware} from "./middleware/error-handler";
import {EnvVariable, getEnvVariable} from "./utils/get-env-variable";

const PORT = getEnvVariable(EnvVariable.PORT) || 3000;
const NODE_ENV = getEnvVariable(EnvVariable.NODE_ENV);

const main = async () => {
  await connect();

  const app = express();

  NODE_ENV === "development" && app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
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
