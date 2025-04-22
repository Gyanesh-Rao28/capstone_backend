import { Request, Response } from 'express';
import prisma from '../../../db';
import { MemberRole, ProjectStatus } from '@prisma/client';
import { generateInviteCode } from '../../../helper/InviteCodeGenerator';


export const createProjectApplication = async (req: Request, res: Response) => {
    try {


        const gid = "d2eb654b-b551-4317-875f-c68f1ea9a041";
        const pid = "3d20255a-e357-4745-b9be-0e72bb2ae83e";
        const sid = "258003e4-91de-4180-8906-a6d288bb540b";

        const { groupId, projectId} = req.query

        const studentId = req.user?.student?.id

        const isMemberLeader = await prisma.member.findFirst({
            where: {
                groupId: groupId as string,
                studentId: studentId,
                memberRole: MemberRole.Leader
            }
        })

        if (!Boolean(isMemberLeader)) {
            console.log("Only Leader can apply for the project application.")
            return;
        }

        const createApplication = await prisma.projectApplication.create({
            data: {
                groupId: groupId as string,
                projectId: projectId as string
            }
        })

        if (!createApplication) {
            console.log("Error in creating project application.")
            return;
        }

        console.log(`Project application has been generated for projectId : ${pid} - \n`, createApplication)



        return res.status(200).json({
            status: 'success',
            data: ""
        });



    } catch (error) {
        console.error('Error creating project group:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: creating group'
        });
    }
};