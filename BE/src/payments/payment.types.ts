import mongoose, { Document } from 'mongoose';

export interface IPayment extends Document {
    ride_id: mongoose.Types.ObjectId;
    amount: mongoose.Types.Decimal128;
    status: 
            |'pending'
            |'completed'
            |'failed';
    created_at: Date;
}