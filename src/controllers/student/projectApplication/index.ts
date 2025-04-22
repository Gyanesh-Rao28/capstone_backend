import { Request, Response } from 'express';
import prisma from '../../../db';
import { MemberRole, ProjectStatus } from '@prisma/client';


export const applyToProject = async (req: Request, res: Response) => {
    try {
        const { projectId, groupId } = req.query;

        if (!projectId) {
            res.status(404).json({
                status: "Not Found",
                message: "Project ID required"
            });
            return;
        }

        if (!groupId) {
            res.status(404).json({
                status: "Not Found",
                message: "Group ID required"
            });
            return;
        }

        const studentId = req.user?.student?.id;

        if (!studentId) {
            res.status(401).json({
                status: "Unauthorized",
                message: "Invalid student Id"
            });
            return;
        }

        const isMemberLeader = await prisma.member.findFirst({
            where: {
                groupId: groupId as string,
                studentId: studentId,
                memberRole: MemberRole.Leader
            }
        });

        if (!Boolean(isMemberLeader)) {
            res.status(403).json({
                status: "Forbidden",
                message: "Only Leader can apply for the project application."
            });
            return;
        }

        const isProjectApplicationAlreadyExist = await prisma.projectApplication.findFirst({
            where: {
                groupId: groupId as string,
                projectId: projectId as string
            }
        });

        if (isProjectApplicationAlreadyExist) {
            res.status(409).json({
                status: "Conflict",
                message: "Your project application already exists"
            });
            return;
        }

        const createApplication = await prisma.projectApplication.create({
            data: {
                groupId: groupId as string,
                projectId: projectId as string
            }
        });

        return res.status(200).json({
            status: 'success',
            data: createApplication
        });

    } catch (error) {
        console.error('Error creating project application:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: creating application'
        });
    }
};