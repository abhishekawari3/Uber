import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { signupController, loginController } from './auth.controller.js';
const router: Router = Router();


router.post('/signup', (
    req: Request,
    res: Response,
    next: NextFunction
)=>{
   signupController(req, res, next);
});

router.post('/login',(
    req: Request,
    res: Response,
    next: NextFunction   
)=>{
    loginController(req, res, next);
});