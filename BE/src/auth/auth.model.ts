import mongoose,{ Schema } from 'mongoose';

const userSchema : mongoose.Schema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['rider', 'driver', 'admin'],
        default: 'rider',
    }
})

export const User : mongoose.Model<any> = mongoose.model('User',userSchema);