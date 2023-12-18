import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;

export const connect = async () => {
  if (!mongoUrl) throw new Error("mongoUrl not provided");
  const connection = await mongoose.connect(mongoUrl);
  console.log(
    `Mongo DB connected. Connection host: ${connection.connection.host}`.cyan
      .underline
  );
};
