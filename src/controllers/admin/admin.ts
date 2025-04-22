import {Request, Response} from 'express';
import prisma from '../../db';
import { UserAdmin } from '../../types';


export const getAdminData = async (req:Request , res:Response)=>{
    try {
        
        const admin: UserAdmin | null = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            },
            include:{
                admin: true
            }
        })

        console.log(req.user)

        console.log(admin)

        res.json(admin);
        
    } catch (error) {
        res.status(400).json({
            error: 'Failed to get admin data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const getAdminAnalytics = async (req: Request, res: Response) => {
    try {
        // Count total faculties
        const facultyCount = await prisma.faculty.count();

        // Count total students
        const studentCount = await prisma.student.count();

        // Course-type-wise distribution
        const courseTypeDistribution = await prisma.project.groupBy({
            by: ['course'],
            _count: {
                course: true
            }
        });

        // Project domain distribution
        const projectDomainDistribution = await prisma.project.groupBy({
            by: ['domain'],
            _count: {
                domain: true
            }
        });

        // Combine all analytics data
        const analytics = {
            facultyCount,
            studentCount,
            courseTypeDistribution,
            projectDomainDistribution
        };

        res.json(analytics);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch admin analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};