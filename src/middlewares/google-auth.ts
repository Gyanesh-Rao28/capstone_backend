import { Request, Response } from 'express';

export function isAuthenticated(req: Request, res: Response, next: Function) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}