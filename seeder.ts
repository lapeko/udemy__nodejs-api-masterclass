import "@colors/colors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import path from "path";

dotenv.config({ path: "./config/.env" });

import { connect } from "./config/db";
import { Bootcamp } from "./v1/bootcamp/bootcamp.model";

const seedDb = async () => {
  await connect();
  const bootcamps = JSON.parse(
    readFileSync(
      path.join(
        __dirname,
        "devcamper_project_resources",
        "_data",
        "bootcamps.json"
      ),
      "utf-8"
    )
  );
  await Bootcamp.create(bootcamps);
  console.log("Bootcamps successfully inserted into DB".green.inverse);
  process.exit(0);
};

const cleanDb = async () => {
  await connect();
  await Bootcamp.deleteMany();
  console.log("Bootcamps successfully deleted from DB".red.inverse);
  process.exit(0);
};

if (process.argv[2] == "-i") seedDb();
else if (process.argv[2] == "-d") cleanDb();
else
  console.log(
    'PLease, provide a flag either "-i" to seed DB or "-d" to clean db. E.g. "npx ts-node ./seeder.ts -i"'
  );
