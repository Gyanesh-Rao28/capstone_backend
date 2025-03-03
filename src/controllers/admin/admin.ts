import {Request, Response} from 'express';
import prisma from '../../db';
import { UserAdmin } from '../../types';


export const getAdminData = async (req:Request , res:Response)=>{
    try {
        
        const admin: UserAdmin | null = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            },
            include:{
                admin: true
            }
        })

        console.log(req.user)

        console.log(admin)

        res.json(admin);
        
    } catch (error) {
        res.status(400).json({
            error: 'Failed to get admin data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}