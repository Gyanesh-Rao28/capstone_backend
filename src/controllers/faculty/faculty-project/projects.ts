import { Request, Response } from 'express';
import prisma from '../../../db';
import { ProjectType } from '../../../types';

export const postProject = async (req: Request, res: Response) => {
    try {
        const { title, description, domain, status, course, tags, deadline } = req.body;

        const requiredFields = ['title', 'description', 'domain', 'course'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            res.status(400).json({
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        const facultyId = req.user?.faculty?.id !!;
        if (!facultyId) {
            res.status(403).json({
                status: 'error',
                message: 'Only faculty members can create projects'
            });
        }

        const faculty = await prisma.faculty.findFirst({
            where: { id: facultyId }
        });

        if (!faculty) {
            res.status(404).json({
                status: 'error',
                message: 'Faculty not found'
            });
        }

        // Create project
        const project: ProjectType | null = await prisma.project.create({
            data: {
                facultyId,
                title,
                description,
                domain,
                status: status || 'draft',
                course,
                tags: tags || [],
                deadline: deadline ? new Date(deadline) : null,
            }
        });

        res.status(201).json({
            status: 'success',
            data: project
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : postProject'
        });
    }
};


export const updateProject = async (req: Request, res: Response) => {
    try {
        
        const { title, description, domain, status, course, tags, deadline } = req.body;
        const { projectId } = req.params

        const requiredFields = ['title', 'description', 'domain', 'course'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            res.status(400).json({
                status: 'error',
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }


        const facultyId = req.user?.faculty?.id!!;
        if (!facultyId) {
            res.status(403).json({
                status: 'error',
                message: 'Only faculty members can create projects'
            });
        }

        const isProjectExist = await prisma.project.findFirst({
            where:{
                id: projectId
            }
        })

        if(!isProjectExist){
            res.status(404).json({
                status: 'error',
                message: 'Project Not Found'
            });
        }


        const updateProject: ProjectType|null = await prisma.project.update({
            where:{
                id: projectId
            },
            data: {
                facultyId,
                title,
                description,
                domain,
                status: status || 'draft',
                course,
                tags: tags || [],
                deadline: deadline ? new Date(deadline) : null,
            }

        })

        return res.status(201).json({
            status: 'success',
            data: updateProject
        });

        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : updateProject'
        });
    }
}

export const delProject = async(req: Request, res: Response)=>{

    try {

        const { projectId } = req.params

        const facultyId = req.user?.faculty?.id!!;
        if (!facultyId) {
            return res.status(404).json({
                status: 'error',
                message: 'Faculty Id not fonud'
            });
        }

        const project = await prisma.project.findUnique({
            where:{
                id: projectId
            }
        })

        if( !project ){
            return res.status(404).json({
                status: 'error',
                message: 'Invalid projectId'
            });
        }

        const delProject = await prisma.project.delete({
            where:{
                id: projectId
            }
        })

        
        return res.status(201).json({
            status: 'success',
            data: delProject
        });
        
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error : getProject'
        });
    }

}