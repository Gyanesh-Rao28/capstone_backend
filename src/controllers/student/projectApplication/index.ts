import { Request, Response } from 'express';
import prisma from '../../../db';
import { MemberRole } from '@prisma/client';


export const applyToProject = async (req: Request, res: Response) => {
    try {
         
        const { projectId, groupId, motivation } = req.body;
        const studentId = req.user?.student?.id;

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


        if (!motivation) {
            res.status(404).json({
                status: "Not Found",
                message: "motivation required"
            });
            return;
        }


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
                projectId: projectId as string,
                motivation: motivation as string
                
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

export const getAllApplication = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.student?.id;

        if (!studentId) {
            res.status(400).json({
                status: 'error',
                message: 'Student ID is required'
            });
            return
        }

        // First, find all groups where the student is a member
        const memberGroups = await prisma.member.findMany({
            where: {
                studentId: studentId
            },
            select: {
                groupId: true
            }
        });

        const groupIds = memberGroups.map(member => member.groupId);

        // Then, find all applications from these groups
        const applications = await prisma.projectApplication.findMany({
            where: {
                groupId: {
                    in: groupIds
                }
            },
            include: {
                project: {
                    select: {
                        title: true,
                        description: true,
                        domain: true,
                        course: true,
                        faculty: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            status: 'success',
            data: applications
        });

    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: fetching applications'
        });
    }
};



export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const {applicationId} = req.query; 

        if (!applicationId) {
            res.status(400).json({
                status: 'error',
                message: 'Application ID is required'
            });
            return
        }

        const studentId = req.user?.student?.id;

        if (!studentId) {
            res.status(400).json({
                status: 'error',
                message: 'Student ID is required'
            });
            return
        }

        // First, find all groups where the student is a member
        const memberGroups = await prisma.member.findMany({
            where: {
                studentId: studentId
            },
            select: {
                groupId: true
            }
        });

        const groupIds = memberGroups.map(member => member.groupId);

        // Find the specific application by ID and validate it belongs to one of the student's groups
        const application = await prisma.projectApplication.findFirst({
            where: {
                id: applicationId as string,
                groupId: {
                    in: groupIds
                }
            },
            include: {
                project: {
                    select: {
                        title: true,
                        description: true,
                        domain: true,
                        course: true,
                        tags: true,
                        deadline: true,
                        faculty: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                },
                group: {
                    include: {
                        members: {
                            include: {
                                student: {
                                    include: {
                                        user: {
                                            select: {
                                                name: true,
                                                email: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Application not found or you do not have access to it'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: application
        });

    } catch (error) {
        console.error('Error fetching application:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: fetching application'
        });
    }
};