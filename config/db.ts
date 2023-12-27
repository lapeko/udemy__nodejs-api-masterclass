import mongoose from "mongoose";
import {EnvVariable, getEnvVariable} from "../utils/get-env-variable";

export const connect = async () => {
  const connection = await mongoose.connect(getEnvVariable(EnvVariable.MONGO_URL));
  console.log(
    `Mongo DB connected. Connection host: ${connection.connection.host}`.cyan
      .underline
  );
};
