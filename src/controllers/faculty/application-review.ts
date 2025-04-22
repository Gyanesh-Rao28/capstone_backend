import { Request, Response } from 'express';
import prisma from '../../db';
import { ApplicationStatus, ProjectStatus } from '@prisma/client';

// Get all applications for faculty's projects
export const getApplications = async (req: Request, res: Response) => {
    try {
        const facultyId = req.user?.faculty?.id;

        if (!facultyId) {
            res.status(400).json({
                status: 'error',
                message: 'Faculty ID not found'
            });
        }

        // Get all project IDs by this faculty

        // TO BE DONE AFTER student(creating group, adding members, create project application) routes.
        // project status draft cases consideration is not done.
        const draftProjects = await prisma.project.findMany({
            where: {
                facultyId: facultyId,
                // status: "draft"
            },
            select: {
                id: true
            }
        });

        // console.log(draftProjects)

        const projectIds = draftProjects.map(project => project.id);

        // console.log(projectIds)

        const newApplications = await prisma.projectApplication.findMany({
            where: {
                // we dont have to show all the project application - we dont have
                // consider those projects which are already taken or assigned.
                projectId: {
                    in: projectIds
                }
            },
            include:{
                project:{
                    select:{
                        id: true,
                        title: true,
                        domain: true,
                        status: true
                    }
                },
                group:{
                    select:{
                        id: true,
                        name: true,
                        currentMember: true,
                        members:{
                            select:{
                                memberRole: true,
                                student:{
                                    select:{
                                        studentId: true
                                    }
                                }
                            }
                        },
                    }
                }
            },
            orderBy:{
                project: {
                    createdAt : 'asc'
                }
            }
        });

        res.status(200).json({
            status: 'success',
            data: newApplications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error: getApplications'
        });
    }
};

// Get a single application by id
export const getApplicationById = async (req: Request, res: Response) => {
    try {
        const { applicationId } = req.params;
        const facultyId = req.user?.faculty?.id;

        if (!facultyId) {
            res.status(401).json({
                status: 'Unauthorized',
                message: 'Authentication is required or has failed.'
            });
            return;
        }

        const application = await prisma.projectApplication.findUnique({
            where: {
                id: applicationId
            },
            include: {
                project: true,
                group: {
                    select:{
                        name: true,
                        currentMember: true,
                        maxMembers: true,
                        members:{
                            select:{
                                memberRole: true,
                                student:{
                                    select:{
                                        id: true,
                                        studentId: true,
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
                }
            }
        });

        if (!application) {
            res.status(404).json({
                status: 'error',
                message: 'Application not found'
            });
            return;
        }

        return res.status(200).json({
            status: 'success',
            data: application
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: getApplicationById'
        });
    }
};


// Review an application (approve/reject)
export const reviewApplication = async (req: Request, res: Response) => {
    try {
        const { applicationId } = req.params;
        const facultyId = req.user?.faculty?.id;
        const { status } = req.query;

        if (!facultyId) {
            res.status(400).json({
                status: 'error',
                message: 'Faculty ID not found'
            });
            return;
        }

        // Validate status
        if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid status. Must be Approved, Rejected, or Pending'
            });
            return
        }

        // Find the application
        const application = await prisma.projectApplication.findFirst({
            where: {
                id: applicationId,
            },
            include: {
                project: {
                    select: {
                        facultyId: true
                    }
                }
            }
        });

        if (!application) {
            res.status(404).json({
                status: 'error',
                message: 'Application not found'
            })
            return;
        }

        // // Check if the application belongs to a project by this faculty
        if (application.project.facultyId !== facultyId) {
            res.status(403).json({
                status: 'Forbidden',
                message: 'You are authenticated but not allowed to access the project application.'
            });
            return;
        }

        const isApproved = status == ApplicationStatus.Approved;
        const isRejected = status == ApplicationStatus.Rejected;

        // console.log(isApproved, isRejected)

        let updatedApplication = null;
        if(isApproved){

            updatedApplication = await prisma.projectApplication.update({
                where: {
                    id: applicationId
                },
                data: {
                    applicationStatus: ApplicationStatus.Approved
                }
            });

            await prisma.project.update({
                where:{
                    id: application.projectId
                },
                data:{
                    status: ProjectStatus.active
                }
            })

        }else if(isRejected){

            updatedApplication = await prisma.projectApplication.update({
                where: {
                    id: applicationId
                },
                data: {
                    applicationStatus: ApplicationStatus.Rejected
                }
            });

        }

        return res.status(200).json({
            status: 'success',
            data: updatedApplication
        });
    } catch (error) {
        console.error('Error reviewing application:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: reviewApplication'
        });
    }
};