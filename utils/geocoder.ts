import NodeGeocoder, { Options } from "node-geocoder";

const options: Options = {
  provider: "mapquest",
  apiKey: process.env.GEOCODER_API_KEY,
};

export const geocoder = NodeGeocoder(options);
