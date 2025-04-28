import { Request, Response } from 'express';
import prisma from '../db';

export const isStudentInProject = async (req: Request, res: Response) => {
    try {
        const { studentId, projectId } = req.query;

        console.log({ studentId, projectId });

        if (!studentId || !projectId) {
            res.status(400).json({
                status: 'Bad Request',
                message: 'Student ID and Project ID are required'
            });
            return;
        }

        // Find any member record where the student is part of a group that belongs to the project
        const member = await prisma.member.findFirst({
            where: {
                studentId: studentId as string,
                group: {
                    projectId: projectId as string
                }
            }
        });     

        console.log("Member found:", member);

        return res.status(200).json({
            status: 'success',
            isInProject: member
        });

    } catch (error) {
        console.error('Error checking if student is in project:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: Failed to check student project membership'
        });
    }
};


export const isAppliedForProject = async (req: Request, res: Response) => {

    try {

        const { projectId, groupId } = req.query

        if (!projectId || !groupId) {
            res.status(404).json({
                status: 'Not found',
                message: 'Fields required'
            });
            return;
        }


        const projectApplied = await prisma.projectApplication.findFirst({
            where: {
                projectId: projectId as string,
                groupId: groupId as string

            }
        })

        return res.status(201).json({
            status: 'success',
            data: Boolean(projectApplied)
        });


    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : isAppliedForProject'
        });
    }

}