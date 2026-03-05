import mongoose, { Schema, Document } from "mongoose";
import type { IRide } from './rides.types.js';


const RideSchema = new Schema<IRide>({
  rider_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  driver_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  pickup_location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  drop_location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  distance: {
    type: Number,
    required: true
  },

  base_fare: {
    type: Number,
    required: true
  },

  surge_multiplier: {
    type: Number,
    default: 1
  },

  total_fare: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: [
      "requested",
      "accepted",
      "started",
      "completed",
      "cancelled"
    ],
    default: "requested"
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

RideSchema.index({ pickup_location: "2dsphere" });

export default mongoose.model<IRide>("Ride", RideSchema);