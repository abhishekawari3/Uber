import jwt from 'jsonwebtoken';
import { User } from './auth.model.js';
import bcrypt from 'bcrypt';
import type { NextFunction } from 'express';

export const signup = async (
    req: Request,
    res:Response,
    next: NextFunction
)