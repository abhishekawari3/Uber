import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';

const router: Router = Router();

router.post('/request', (
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    const {}
    requestRideController()
});