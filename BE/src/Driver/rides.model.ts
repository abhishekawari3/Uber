import mongoose from 'mongoose';

const DriverSchema: mongoose.Schema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        auto:true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vehicle_type:{
        type: String,
        enum: ['Go','X','Xl','Black','BlackXl'],
        required: true
    },
    vehicle_number:{
        type: String,
        required: true,
        unique: true,
    },
    rating:{
        type: mongoose.Schema.Types.Double,
        min: 0,
        max:5,
        default: 0
    },
    is_available:{
        type: Boolean,
        default: true,
    },
    created_at:{
        type: Date,
        default: Date.now,
    }
})

export const Driver : mongoose.Model<any> = mongoose.model('Driver', DriverSchema);