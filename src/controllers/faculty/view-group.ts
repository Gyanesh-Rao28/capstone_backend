import { Request, Response } from 'express';
import prisma from '../../db';

export const getGroupById = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const facultyId = req.user?.faculty?.id;

        if (!facultyId){
            res.status(401).json({
                status: 'Failed',
                message: 'unauthorized'
            })
            return;
        }

        if (!groupId) {
            res.status(422).json({
                status: 'Falied',
                message: 'Server was unable to process the request because it contains invalid data'
            })
            return;
        }

        const groupUnderFaculty = await prisma.group.findFirst({
            where:{
                id: groupId
            },
            select:{
                project:{
                    select: {
                        id : true,
                        facultyId: true,
                        title: true,
                        description: true
                    }
                },
                members: {
                    include:{
                        student: {
                            select:{
                                rollNumber: true,
                                user:{
                                    select:{
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!(facultyId === groupUnderFaculty?.project.facultyId)){
            res.status(403).json({ 
                status: 'Failed', message: 'Forbidden'
            })
        }

        res.status(200).json({
            status: 'success',
            data: groupUnderFaculty
        });

        

    } catch (error) {
        console.error('Error Viewing group byt faculty:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: ViewGroup-Faculty'
        });
    }
};