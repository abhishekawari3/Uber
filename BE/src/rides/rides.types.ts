import mongoose, { Document } from "mongoose";

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
} 

export interface IRide extends Document {
  rider_id: mongoose.Types.ObjectId;
  driver_id?: mongoose.Types.ObjectId;
  pickup_location: IGeoPoint;
  drop_location: IGeoPoint;
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
};