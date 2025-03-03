//  middlewares/google-auth.ts

import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../db';
import { UserType } from '../types';

interface RequestWithUser extends Request{
    user?: UserType
}


const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

export const isAuthenticated = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.isAuthenticated()) {
            next();
            return;
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Authorization header missing or invalid format'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {   

            const tokenInfo = await client.getTokenInfo(token);
            const user = await prisma.user.findFirst({
                where: { email: tokenInfo.email }
            });

            if (!user) {
                res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                });
                return;
            }

            
            req.user = user;
            console.log("authorizing user : ",req.user.role)
            next();
            return;

        } catch (tokenError) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
            return;
        }

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Authentication error'
        });
        return;
    }
};