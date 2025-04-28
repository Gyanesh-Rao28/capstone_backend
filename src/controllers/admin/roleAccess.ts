import { Request, Response } from 'express';
import prisma from '../../db';
import { UserRole } from '@prisma/client';

export const assignFacultyRole = async (req: Request, res: Response) => {
    try {
        const { userId, department, designation } = req.query;

        if (!userId) {
            res.status(400).json({
                status: 'Failed',
                message: 'userId is required'
            });
            return;
        }

        const userExist = await prisma.user.findFirst({
            where: {
                id: userId as string
            }
        });

        if (!userExist) {
            res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
            return;
        }

        const isFacultyAlreadyCreated = await prisma.faculty.findFirst({
            where: {
                userId: userId as string
            }
        });

        if (isFacultyAlreadyCreated) {
            res.status(409).json({
                status: 'Failed',
                message: 'Faculty record already exists'
            });
            return;
        }

        const facultyRole = await prisma.user.update({
            where: {
                id: userId as string
            },
            data: {
                role: UserRole.faculty
            }
        });


        await prisma.faculty.create({
            data: {
                // name: String(name),
                // email: String(email),
                userId: userId as string,
                department: department ? String(department) : "Not Assigned",
                designation: designation ? String(designation) : "Not Assigned"
            }
        });

        return res.status(200).json({
            status: 'success',
            message: `Faculty role has been assigned to user with ID: ${userId}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: assignFacultyRole'
        });
    }
};

export const assignStudentRole = async (req: Request, res: Response) => {
    try {
        const { userId, studentId, batch } = req.query;

        if (!userId) {
            res.status(400).json({
                status: 'Failed',
                message: 'userId is required'
            });
            return;
        }

        if (!studentId) {
            res.status(400).json({
                status: 'Failed',
                message: 'studentId is required'
            });
            return;
        }

        const userExist = await prisma.user.findFirst({
            where: {
                id: userId as string
            }
        });

        if (!userExist) {
            res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
            return;
        }

        // Check if student record already exists
        const isStudentAlreadyCreated = await prisma.student.findFirst({
            where: {
                userId: userId as string
            }
        });

        if (isStudentAlreadyCreated) {
            res.status(409).json({
                status: 'Failed',
                message: 'Student record already exists'
            });
            return;
        }

        // Check if the studentId is already in use
        const studentIdExists = await prisma.student.findFirst({
            where: {
                studentId: studentId as string
            }
        });

        if (studentIdExists) {
            res.status(409).json({
                status: 'Failed',
                message: 'Student ID is already in use'
            });
            return;
        }

        // Update user role
        const studentRole = await prisma.user.update({
            where: {
                id: userId as string
            },
            data: {
                role: UserRole.student
            }
        });

        // Create student record
        await prisma.student.create({
            data: {
                userId: userId as string,
                studentId: studentId as string,
                batch: batch ? String(batch) : String(new Date().getFullYear()),
                // name: userExist.name,
                // email: userExist.email
            }
        });

        return res.status(200).json({
            status: 'success',
            message: `Student role has been assigned to user with ID: ${userId}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: assignStudentRole'
        });
    }
};

export const assignAdminRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            res.status(400).json({
                status: 'Failed',
                message: 'userId is required'
            });
            return;
        }

        const userExist = await prisma.user.findFirst({
            where: {
                id: userId as string
            }
        });

        if (!userExist) {
            res.status(404).json({
                status: 'Failed',
                message: 'User not found'
            });
            return;
        }

        // Check if admin record already exists
        const isAdminAlreadyCreated = await prisma.admin.findFirst({
            where: {
                userId: userId as string
            }
        });

        if (isAdminAlreadyCreated) {
            res.status(409).json({
                status: 'Failed',
                message: 'Admin record already exists'
            });

            return;
        }

        // Update user role
        const adminRole = await prisma.user.update({
            where: {
                id: userId as string
            },
            data: {
                role: UserRole.admin
            }
        });

        // Create admin record
        const createAdmin = await prisma.admin.create({
            data: {
                userId: userId as string
            }
        });

        return res.status(200).json({
            status: 'success',
            message: `Admin role has been assigned to user with ID: ${userId}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error: assignAdminRole'
        });
    }
};