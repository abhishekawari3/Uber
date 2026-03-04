import type { Request, Response, NextFunction } from 'express';
import type { LoginDTO, SignupDTO } from './auth.types.js';
import { signupService,loginService } from './auth.services.js';


export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {name,email,password}: SignupDTO = req.body;
        const data: any = await signupService(req,res,next);
        
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
    };
};

const loginController =  async(
    req: Request,
    res:Response,
    next: NextFunction
) =>{
    try{
        const { email , password }: LoginDTO = req.body;
        
        const data: any = await loginService(req,res,next);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            header: {
                token: data.token
            }
        });

    } catch(err: any){
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    };
};