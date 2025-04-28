import { Request, Response } from 'express';
import prisma from '../../../db';
import { MemberRole, ProjectStatus } from '@prisma/client';
import { generateInviteCode } from '../../../helper/InviteCodeGenerator';

// create a project group and creator of group will be leader
export const createGroup = async (req: Request, res: Response) => {
    try {
        
        const { projectId, grpName } = req.query;
        const studentId = req.user?.student?.id
        // can extract studentId from req.user

        if(!projectId || !studentId || !grpName){
            res.status(404).json({
                status: 'Not found',
                message: `${projectId} ${studentId} ${grpName}} all fields required.`
            })
            return;
        }

        const isStudentAssociatedWithProject = await prisma.member.findFirst({
            where: {
                studentId: studentId as string,
                group: {
                    projectId: projectId as string
                }
            },
            select:{
                memberRole: true
            }
        });

        console.log("stage0: ", isStudentAssociatedWithProject)

        if(isStudentAssociatedWithProject){
            res.status(409).json({
                status: "Conflict",
                message: "Your are already associated with this project."
            })
            return;
        }

        const isProjectExist = await prisma.project.findFirst({
            where: {
                id: projectId as string
            },
            select:{
                status: true
            }
        })

        console.log("stage1: ", isProjectExist)
        
        if(!isProjectExist){
            res.status(404).json({
                status: 'Not found',
                message: "project doesn't exist."
            })
            return;
        }

        if(isProjectExist.status !== ProjectStatus.draft){
            res.status(409).json({
                status: "Conflict",
                message: "This project is already taken or completed"
            })
            return;
        }
        

        const generatedInvitedCode = generateInviteCode(5, projectId as string, studentId as string);
    
        const group = await prisma.group.create({
            data: {
                projectId: projectId as string,
                name: grpName as string,
                inviteCode: generatedInvitedCode as string
            }
        })
            
        console.log("stage2: ", group)

        if (!group.id) {
            console.log("error in grp id")
        }

        const createGroupLeader = await prisma.member.create({
            data: {
                groupId: group.id,
                studentId: studentId as string,
                memberRole: MemberRole.Leader
            }
        })

        console.log("stage 3: ", createGroupLeader)


        return res.status(200).json({
            status: 'success',
            data: { group, createGroupLeader }
        });



    } catch (error) {
        console.error('Error creating project group:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: creating group'
        });
    }
};

// adding a group member through invite code
export const addGroupMember = async (req: Request, res: Response) => {
    try {

        const { inviteId } = req.query;
        const studentId = req.user?.student?.id

        if (!studentId) {
            res.status(401).json({
                status: "Unauthorized",
                message: "Invalid Student Id"
            })
            return;
        }

        if (!inviteId) {
            res.status(404).json({
                status: "Not Found",
                message: "invite Id required"
            })
            return
        }

        const isGroupExists = await prisma.group.findFirst({
            where: {
                inviteCode: inviteId as string
            }
        })

        if (!isGroupExists) {
            res.status(404).json({
                status: "Not found",
                message: "group doesn't exists"
            })
            return;
        }

        console.log("Stage0: ", isGroupExists)

        const grpMaxSize = isGroupExists?.maxMembers!
        const grpCurrSize = isGroupExists?.currentMember!

        if (!(grpCurrSize < grpMaxSize)) {
            res.status(409).json({
                status: "Conflict",
                message: "Group is already full"
            })
            return;
        }

        const alreadyInGrp = await prisma.member.findFirst({
            where: {
                groupId: isGroupExists.id,
                studentId: studentId as string
            },
            select: {
                memberRole: true
            }
        })


        console.log("Stage1: ", Boolean(alreadyInGrp), alreadyInGrp?.memberRole)


        if (Boolean(alreadyInGrp)) {
            res.status(409).json({
                status: "Conflict",
                message: `Your are already in group as ${alreadyInGrp?.memberRole}`
            })
            return;
        }



        const addMember = await prisma.member.create({
            data: {
                groupId: isGroupExists?.id,
                studentId: studentId as string
            }
        })

        console.log("Stage2: ", addMember)


        // flag part to be tested
        const grpUpdatedSize = grpCurrSize + 1;
        let flag = true;
        if (grpUpdatedSize >= grpMaxSize) {
            flag = false;
        }

        const updatingGrpStatus = await prisma.group.update({
            where: {
                id: isGroupExists.id
            },
            data: {
                currentMember: grpUpdatedSize,
                isOpen: flag
            }
        })

        console.log("Stage3: ", updatingGrpStatus)


        return res.status(200).json({
            status: 'success',
            data: updatingGrpStatus
        });



    } catch (error) {
        console.error('Error adding member:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: adding member'
        });
    }
};

// leaving project group [by member not by leader]
export const leaveGroup = async (req: Request, res: Response) => {
    try {

        const {groupId} = req.query
        const studentId = req.user?.student?.id

        if (!studentId) {
            res.status(401).json({
                status: "Unauthorized",
                message: "Invalid Student Id"
            })
            return;
        }
        if (!groupId){
            res.status(404).json({
                status: "Not found",
                message: "Group Id required"
            })
            return;
        }

        const isGroupExist = await prisma.group.findFirst({
            where:{
                id: groupId as string
            }
        })

        console.log("stage 0:", isGroupExist)

        if (!isGroupExist){
            res.status(404).json({
                status: "Not found",
                message: "Group doesn't exist or invalid group id"
            })
            return
        }

        const isMember = await prisma.member.findFirst({
            where:{
                groupId: groupId as string,
                studentId
            }
        })

        if(!isMember){
            res.status(403).json({
                status: "Forbidden",
                message: "your are not a member of this group"
            })
            return
        }

        console.log("stage 1:", isMember)

        if(isMember?.memberRole === MemberRole.Leader){
            res.status(409).json({
                status: "Conflict",
                message: "Group leader can't leave the group"
            })
            return
        }

        const removeMember = await prisma.member.delete({
            where:{
                id: isMember?.id
            }
        })

        if(!removeMember){
            res.status(409).json({
                status: "Conflict",
                message: "Group leader can't leave the group"
            })
            return
        }

        let updateMember = Number( isGroupExist?.currentMember) - 1

        const updatedGroup = await prisma.group.update({
            where:{
                id: isGroupExist?.id
            },
            data:{
                currentMember: updateMember,
                isOpen: true
            }
        })


        return res.status(200).json({
            status: 'success',
            data: updatedGroup
        });


    } catch (error) {
        console.error('Error adding member:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: adding member'
        });
    }
};

// remove a member from project group [it will done by leader only]
export const removeMember = async (req: Request, res: Response) => {
    try {
        // here memberId means - which leader wants to remove member from group
        const { memberId, groupId } = req.query
        const studentId = req.user?.student?.id

        if (!studentId) {
            res.status(401).json({
                status: "Unauthorized",
                message: "Invalid Student Id"
            })
            return;
        }
        if (!memberId || !groupId) {
            res.status(404).json({
                status: "Not found",
                message: "all parameters required"
            })
            return;
        }

        const isGroupExist = await prisma.group.findFirst({
            where:{
                id: groupId as string
            }
        })

        
        const isLeader = await prisma.member.findFirst({
            where:{
                studentId: studentId,
                groupId: groupId as string
            }
        })

        if(!isLeader){
            res.status(409).json({
                status: "Conflict",
                message: "You are not a part of this group"
            })
            return;
        }


        if(isLeader?.memberRole !== MemberRole.Leader){
            res.status(409).json({
                status: "Conflict",
                message: "Only Group Leader can remove the group"
            })
            return;
        }

        const isRemovingMemberExist = await prisma.member.findFirst({
            where:{
                id: memberId as string
            }
        })
        
        if(isLeader.groupId !== isRemovingMemberExist?.groupId){
            res.status(409).json({
                status: "Conflict",
                message: "This member doesn't belong to your group"
            })
            return;
        }

        await prisma.member.delete({
            where:{
                id: isRemovingMemberExist.id
            }
        })


        let updateMember = Number(isGroupExist?.currentMember) - 1

        const updatedGroup = await prisma.group.update({
            where: {
                id: isGroupExist?.id
            },
            data: {
                currentMember: updateMember,
                isOpen: true
            }
        })
        


        return res.status(200).json({
            status: 'success',
            data: updatedGroup
        });


    } catch (error) {
        console.error('Error adding member:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: adding member'
        });
    }
};