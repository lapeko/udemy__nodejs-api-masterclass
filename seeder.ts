import "@colors/colors";
import dotenv from "dotenv";
import {readFileSync} from "fs";
import path from "path";

dotenv.config({ path: "./config/.env" });

import {connect} from "./config/db";
import {Bootcamp} from "./v1/bootcamp/bootcamp.model";
import {Course} from "./v1/course/course.model";
import {User} from "./v1/user/user.model";

const seedDb = async () => {
  await connect();
  const users = readMockFromFileSync("users");
  const bootcamps = readMockFromFileSync("bootcamps");
  const courses = readMockFromFileSync("courses");

  for (const user of users) await User.create(user);
  for (const bootcamp of bootcamps) await Bootcamp.create(bootcamp);
  for (const course of courses) await Course.create(course);

  console.log("DB successfully seeded".green.inverse);
  process.exit(0);
};

const cleanDb = async () => {
  await connect();

  await Bootcamp.deleteMany();
  await Course.deleteMany();
  await User.deleteMany();

  console.log("DB successfully cleaned up".red.inverse);
  process.exit(0);
};

if (process.argv[2] == "-i") seedDb();
else if (process.argv[2] == "-d") cleanDb();
else
  console.log('PLease, provide a flag either "-i" to seed DB or "-d" to clean db. E.g. "npx ts-node ./seeder.ts -i"');

const readMockFromFileSync = (fileName: string) =>
  JSON.parse(readFileSync(path.join(__dirname, "devcamper_project_resources", "_data", `${fileName}.json`), "utf-8"));
