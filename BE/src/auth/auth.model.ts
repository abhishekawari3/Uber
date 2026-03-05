import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser } from './auth.types.js';

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["rider", "driver", "admin"],
      default: "rider"
    }
  },
  {
    timestamps: true
  }
)

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)