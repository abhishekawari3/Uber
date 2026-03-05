import mongoose, { Document } from "mongoose";

export interface IRide extends Document {
  rider_id: mongoose.Types.ObjectId;
  driver_id?: mongoose.Types.ObjectId;

  pickup_location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };

  drop_location: {
    type: "Point";
    coordinates: [number, number];
  };

  distance: number;
  base_fare: number;
  surge_multiplier: number;
  total_fare: number;

  status:
    | "requested"
    | "accepted"
    | "started"
    | "completed"
    | "cancelled";

  created_at: Date;
}