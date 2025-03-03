import { Request, Response } from 'express';
import prisma from '../db';
import { ProjectType } from '../types';
import { UserRole } from '@prisma/client';

// /api/projects
export const getProject = async (req: Request, res: Response) => {

    try {


        const isUserInvalid = req.user?.role === UserRole.user

        if(isUserInvalid){
            return res.status(403).json({
                status: 'error',
                message: 'Access Denied'
            });
        }

        const projects:ProjectType[]|[] = await prisma.project.findMany({})


        return res.status(201).json({
            status: 'success',
            data: projects
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : getProject'
        });
    }

}


// /api/projects/:projectId
export const getProjectById = async (req: Request, res: Response) => {

    try {

        const { projectId } = req.params

        const isUserInvalid = req.user?.role === UserRole.user

        if (!projectId){
            return res.status(404).json({
                status: 'error',
                message: 'projectId not found'
            });
        }

        if (isUserInvalid) {
            return res.status(403).json({
                status: 'error',
                message: 'Access Denied'
            });
        }

        const project:ProjectType|null = await prisma.project.findUnique({
            where: {
                id: projectId
            },
        })
        

        return res.status(201).json({
            status: 'success',
            data: project
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : getProject'
        });
    }

}
