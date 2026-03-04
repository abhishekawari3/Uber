import type { Request, Response, NextFunction } from 'express';
import type { SignupDTO } from './auth.types.js';



export const signup = async (
    req: Request,
    res:Response,
    next:NextFunction
) => {
    try{
        const {name,email,password}: SignupDTO = req.body;

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
        } );
    }
}