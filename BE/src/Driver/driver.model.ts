import mongoose, { Schema, Document, Model } from "mongoose";
import type{ IDriver } from './driver.types.js';


const DriverSchema: Schema<IDriver> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  vehicle_type: {
    type: String,
    enum: ["Go", "X", "Xl", "Black", "BlackXl"],
    required: true
  },

  vehicle_number: {
    type: String,
    required: true,
    unique: true
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  is_available: {
    type: Boolean,
    default: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Driver: Model<IDriver> = mongoose.model<IDriver>("Driver", DriverSchema);