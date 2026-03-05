import mongoose, { Document } from "mongoose";

export interface IDriver extends Document {
  user_id: mongoose.Types.ObjectId;
  vehicle_type: "Go" | "X" | "Xl" | "Black" | "BlackXl";
  vehicle_number: string;
  rating: number;
  is_available: boolean;
  created_at: Date;
}