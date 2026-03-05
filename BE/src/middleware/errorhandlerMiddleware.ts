import type { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

export const errorHandlerMiddleware: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack ?? err);

    const statusCode: number = err.statusCode ?? 500;
    const message: string = err.statusCode ? err.message : 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message,
    });
};