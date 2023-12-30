import mongoose, {Document} from "mongoose";
import slugify from "slugify";

import { ErrorResponse } from "../../utils/error-response";
import { geocoder } from "../../utils/geocoder";

type BootcampLocation = {
  type: "Point";
  coordinates?: number;
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

interface BootcampDocument extends Document {
  name: string;
  slug: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  location: BootcampLocation,
  careers: Array<"Web Development" | "Mobile Development" | "UI/UX" | "Data Science" | "Business" | "Other">;
  averageRating: number;
  averageCost: number;
  photo: string;
  user: mongoose.Schema.Types.ObjectId;
}

const LocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number, undefined],
    index: "2dsphere",
    required: true,
  },
  formattedAddress: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
});

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      unique: true,
      maxLength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please provide description"],
      maxLength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxLength: [20, "Can not be longer than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "PLease add a valid email",
      ],
    },
    address: {
      type: String,
    },
    location: LocationSchema,
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must be not more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

BootcampSchema.pre("save", async function (next) {
  if (this.location) next();

  if (!this.address) throw new ErrorResponse(400, "Address was not provided");

  const [location] = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [location.latitude, location.longitude],
    formattedAddress: location.formattedAddress,
    street: location.streetName,
    city: location.city,
    state: location.stateCode,
    zipcode: location.zipcode,
    country: location.countryCode,
  };

  this.address = undefined;
  next();
});

BootcampSchema.pre("deleteOne", async function (next) {
  const Course = mongoose.model("Course");
  await Course.deleteMany({ bootcamp: this.getQuery()._id });
  next();
});

BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

export const Bootcamp = mongoose.model<BootcampDocument>('Bootcamp', BootcampSchema);