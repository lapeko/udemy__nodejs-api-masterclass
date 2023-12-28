import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import {ErrorResponse} from "../../utils/error-response";
import {EnvVariable, getEnvVariable} from "../../utils/get-env-variable";

const jwtSecret = getEnvVariable(EnvVariable.JWT_SECRET_KEY);
const jwtExpiresIn = getEnvVariable(EnvVariable.JWT_EXPIRE_IN);

export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: string;
  updatedAt: NativeDate;
  createdAt: NativeDate;
  getJwtToken: () => string;
  checkPassword: (password: string) => Promise<boolean>;
}

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
    unique: [true, "This email has already taken"],
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

userSchema.pre("save", async function(next) {
  if (!this.password) throw new ErrorResponse(400, "Password not provided");

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.getJwtToken = function() {
  return jsonwebtoken.sign({id: this._id}, jwtSecret, {expiresIn: jwtExpiresIn});
};

userSchema.methods.checkPassword = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>("User", userSchema);
