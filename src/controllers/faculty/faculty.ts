import { Request, Response } from 'express';
import prisma from '../../db';
import { UserFaculty } from '../../types';


export const getfacultyData = async (req: Request, res: Response)=>{
    try {

        

        const faculty: UserFaculty | null = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            },
            include:{
                faculty:{
                    include:{
                        projects:true
                    }
                }
            }
        })

        res.json(faculty)
        
    } catch (error) {
        
    }
}
