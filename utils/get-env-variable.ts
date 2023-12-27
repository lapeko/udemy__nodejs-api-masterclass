import {ErrorResponse} from "./error-response";

export enum EnvVariable {
  NODE_ENV="NODE_ENV",
  PORT="PORT",
  MONGO_URL="MONGO_URL",
  GEOCODER_API_KEY="GEOCODER_API_KEY",
  PUBLIC_PATH="PUBLIC_PATH",
  MAX_IMAGE_SIZE_KB="MAX_IMAGE_SIZE_KB",
};

export const getEnvVariable = (key: EnvVariable) => {
  const envVariable = process.env[key];
  if (!envVariable) {
    console.error(`Process.env[${key}] is not defined`);
    throw new ErrorResponse(500, "Unexpected server error");
  }
  return envVariable;
};
