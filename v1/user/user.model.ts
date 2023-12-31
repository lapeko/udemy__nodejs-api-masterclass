import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

import {ErrorResponse} from "../../utils/error-response";
import {EnvVariable, getEnvVariable} from "../../utils/get-env-variable";

const jwtSecret = getEnvVariable(EnvVariable.JWT_SECRET_KEY);
const jwtExpiresIn = getEnvVariable(EnvVariable.JWT_EXPIRE_IN);

export interface IUserDocument extends mongoose.Document {
  name: string;
  email: string;
  role: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  updatedAt: NativeDate;
  createdAt: NativeDate;
  getJwtToken: () => string;
  checkPassword: (password: string) => Promise<boolean>;
  resetPassword: () => string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "PLease add a valid email",
    ],
    required: [true, "Please provide an email"],
    unique: [true, "This email has already taken"],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
    required: [true, "Role is not provided"],
  },
  password: {
    type: String,
    minLength: [6, "Password should have at least 6 characters"],
    required: [true, "Password not provided"],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true,
});

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password"))
    return next();

  if (!this.password)
    throw new ErrorResponse(400, "Password not provided");

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.getJwtToken = function() {
  return jsonwebtoken.sign({id: this._id}, jwtSecret, {expiresIn: jwtExpiresIn});
};

UserSchema.methods.checkPassword = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.resetPassword = function() {
  const resetToken =  crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model<IUserDocument>("User", UserSchema);
