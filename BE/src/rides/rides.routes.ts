import { Router } from 'express';
import  type{ NextFunction, Request, Response } from 'express';
import { requestRide } from './rides.controller.js';

const router: Router = Router();

router.post('/request', (
    req: Request,
    res: Response, 
    next: NextFunction
) => {
    
    requestRide(req, res, next).catch(next);
});

router.get('/', (req: Request, res: Response, next:NextFunction) => {
   
})

export default router;