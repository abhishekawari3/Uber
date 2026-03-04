import jwt from 'jsonwebtoken';
import { User } from './auth.model.js';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import type { UserType } from './auth.types.js';

export const signupService = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const { email, password, name } = req.body;
        const existing_User: UserType | null = await User.findOne({ email });

        if (existing_User) {
            return res.status(400).json({
                success: false,
                message: 'email already exists'
            });
        }

        const hashpassword: string = await bcrypt.hash(password, 10);

        await User.create({
            name: name,
            email: email,
            password: hashpassword
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const loginService = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const user: UserType | null = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const secret = process.env.JWT_SECRET_KEY;
        if (!secret) throw new Error('JWT_SECRET_KEY is not defined');

        const token: string = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                role: user.role
            },
            secret,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        next(error);
    }
};