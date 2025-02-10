import { UserRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { UserType } from '../types';

interface RequestWithUser extends Request{
    user?: UserType
}


export const FacultyMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== UserRole.faculty) {
            res.status(401).json({
                status: 'error',
                message: 'faculty Access deined'
            });
            return;
        }

        const facultyUser = await prisma.user.findFirst({
            where: {
                id: req.user.id
            },
            include: {
                faculty: true
            }
        })

        if (!facultyUser) {
            res.status(401).json({
                status: 'error',
                message: 'faculty not found'
            });
            return;
        }

        req.user = facultyUser
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