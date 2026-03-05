import type { Request, Response, NextFunction } from 'express';
import type { LoginDTO, SignupDTO, SignupResult, LoginResult } from './auth.types.js';
import { signupService, loginService } from './auth.services.js';

export const signupController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password }: SignupDTO = req.body;
        const data: SignupResult = await signupService({ name, email, password });

        res.status(201).json({
            success: true,
            data: {
                message: 'User created successfully',
                userId: data.user._id,
            },
        });
    } catch (err: unknown) {
        next(err); 
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password }: LoginDTO = req.body;
        const data: LoginResult = await loginService({ email, password });

        res.setHeader('Authorization', `Bearer ${data.token}`);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: data.token,
        });
    } catch (err: unknown) {
        next(err);
    }
};