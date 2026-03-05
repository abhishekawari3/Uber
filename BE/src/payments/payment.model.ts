import mongoose from "mongoose";
import type { IPayment } from './payment.types.js';

const PaymentSchema = new mongoose.Schema<IPayment>({
    ride_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Ride",
        required: true
    },
    amount:{
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        required: true
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

export const Payment = mongoose.model<IPayment>("payment", PaymentSchema);