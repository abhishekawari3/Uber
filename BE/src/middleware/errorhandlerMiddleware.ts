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

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
  }
}