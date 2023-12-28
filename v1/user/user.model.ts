import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add a name"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "PLease add a valid email",
    ],
    require: [true, "Please provide an email"],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
    require: [true, "Role is not provided"],
  },
  password: {
    type: String,
    minLength: [6, "Password should be longer than 6 characters"],
    require: [true, "Password not provided"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

export const User = mongoose.model("User", userSchema);
