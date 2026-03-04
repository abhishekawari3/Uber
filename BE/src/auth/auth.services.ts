import jwt from 'jsonwebtoken';
import { User } from './auth.model.js';
import bcrypt from 'bcrypt';
import type { Request,Response, NextFunction } from 'express';

export const signupController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password, name } = req.body;
    const existing_User: any = await User.findOne({email});

        if(existing_User) {
            return res.status(400).json({
                success: false,
                message: 'email already exists'
            });
        }

        const hashpassword : string = await bcrypt.hash(password,10);

        User.create({
            name: name,
            email: email,
            password: hashpassword
        });
};

export const loginController = async(
    req:Request,
    res:Response,
    next: NextFunction
) =>{
    const  { email, password } = req.body;

    const user: any = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    const isMatch : boolean = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        })
    }

}