import { UserRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { UserType } from '../types';

interface RequestWithUser extends Request {
    user?: UserType
}



export const StudentMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== UserRole.student) {
            res.status(401).json({
                status: 'error',
                message: 'Student Access deined'
            });
            return;
        }

        const StudentUser = await prisma.user.findFirst({
            where: {
                id: req.user.id
            },
            include: {
                student: true
            }
        })

        if (!StudentUser) {
            res.status(401).json({
                status: 'error',
                message: 'Student not found'
            });
            return;
        }

        req.user = StudentUser
        console.log({ "authorizing Role": req.user.role })

        next()

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
        return;
    }
}