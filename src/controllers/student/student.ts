import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../../db';
import { UserStudent } from '../../types';

export const getStudent = async (req: Request, res: Response) => {

    try {

        const student: UserStudent | null  = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            },
            include:{
                student: true
            }
        })

        res.json(student)
        

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : getProject'
        });
    }

}