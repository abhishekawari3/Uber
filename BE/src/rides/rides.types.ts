import mongoose, { Document } from "mongoose";
import type { IDriver } from './../driver/driver.types.js';


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

export interface fareResult {
  base_fare: number;
  surge_multiplier: number;
  total_fare: number;
}

export interface RideRequestData {
  rider_id: mongoose.Types.ObjectId;
  pickup_location: IGeoPoint;
  drop_location: IGeoPoint;
  vehicle_type?: string;
}

export interface RideResult {
  ride: IRide;
  driver: IDriver;
  nearby_drivers_count: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId;
      };
    }
  }
}

export {};