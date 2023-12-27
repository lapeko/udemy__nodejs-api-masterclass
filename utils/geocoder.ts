import NodeGeocoder, {Options} from "node-geocoder";

import {EnvVariable, getEnvVariable} from "./get-env-variable";

const options: Options = {
  provider: "mapquest",
  apiKey: getEnvVariable(EnvVariable.GEOCODER_API_KEY),
};

export const geocoder = NodeGeocoder(options);
