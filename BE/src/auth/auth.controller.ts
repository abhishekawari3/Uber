import type { Request, Response, NextFunction } from 'express';
import type { SignupDTO } from './auth.types.js';
import { signupController } from './auth.services.js';


export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {name,email,password}: SignupDTO = req.body;
        const data: any = await signupController(req,res,next);
        
         res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: data
        });
        
    } catch(err: any){
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}