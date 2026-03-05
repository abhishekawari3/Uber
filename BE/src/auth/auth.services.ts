import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './auth.model.js';
import type { LoginDTO, SignupDTO, SignupResult, LoginResult } from './auth.types.js';

export const signupService = async (
    { name, email, password }: SignupDTO): Promise<SignupResult> => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error('Email already exists');
        (error as any).statusCode = 409;
        throw error;
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        user: {
            _id: user._id.toString(),
        },
    };
};

export const loginService = async ({ email, password }: LoginDTO): Promise<LoginResult> => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error('Invalid credentials');
        (error as any).statusCode = 401;
        throw error;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Invalid credentials');
        (error as any).statusCode = 401;
        throw error;
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error('JWT_SECRET_KEY is not defined');

    const token: string = jwt.sign(
        {
            userId: user._id,
            name: user.name,
            role: user.role,
        },
        secret,
        { expiresIn: '1d' }
    );

    return { token };
};