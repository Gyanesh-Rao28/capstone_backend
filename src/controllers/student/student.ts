import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';

export const getStudent = async (req: Request, res: Response) => {

    try {

        const student = req.user?.student

        console.log(req.user)


        return res.status(200).json({
            status: 'success',
            data: student
        });
        

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : getProject'
        });
    }

}