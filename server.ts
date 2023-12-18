import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import "@colors/colors";

dotenv.config({ path: "./config/.env" });

import { router } from "./router";
import { connect } from "./config/db";

const PORT = process.env.PORT || 3000;

const main = async () => {
  await connect();

  const app = express();

  process.env.NODE_ENV === "development" && app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(router);

  const server = app.listen(PORT, () =>
    console.log(
      `Server running on port ${PORT} in mode ${process.env.NODE_ENV}`.green
        .bold
    )
  );

  process.on("unhandledRejection", (error) => {
    if (error instanceof Error) console.error(error.message.red.bold);
    else if (typeof error === "string") console.error(error);
    else throw error;

    server.close(() => process.exit(1));
  });
};

main();
