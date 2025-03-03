import { UserRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { UserType } from '../types';

interface RequestWithUser extends Request{
    user?: UserType
}



export const AdminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction)=>{
    try {
        if(req.user?.role !== UserRole.admin){
            res.status(401).json({
                status: 'error',
                message: 'Admin Access deined'
            });
            return;
        }

        const adminUser = await prisma.user.findFirst({
            where:{
                id: req.user.id
            },
            include:{
                admin: true
            }
        })

        if (!adminUser) {
            res.status(401).json({
                status: 'error',
                message: 'Admin not found'
            });
            return;
        }

        req.user = adminUser
        console.log({"authorizing Role" : req.user.role})
        
        next()
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
        return;
    }
}