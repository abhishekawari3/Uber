import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from "express";
import type { payloadType } from '../auth/auth.types.js';


export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1] 
        ?? req.headers["x-auth-token"];

    if (!token || Array.isArray(token)) {
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        });
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error('JWT_SECRET_KEY is not defined');

    try {
        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded; // attach user to request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};