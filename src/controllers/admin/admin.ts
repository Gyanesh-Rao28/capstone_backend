import {Request, Response, NextFunction} from 'express';
import multer from 'multer';
// import csvParser from 'csv-parser';
// import fs from 'fs';
import prisma from '../../db';
import { UserAdmin } from '../../types';


const upload = multer({ dest: 'uploads/' });

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

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const adminId = req.user?.admin?.id;

        if (!adminId) {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized: Admin access required'
            });
        }

        // Fetch all users from the database
        const users = await prisma.user.findMany({
            include: {
                faculty: true,
                student: true,
                admin: true
            }
        });

        return res.status(200).json({
            status: 'success',
            data: users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user data',
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

// Upload Faculty CSV
// export const uploadFacultyCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const file = req.file;
//         if (!file) {
//             res.status(400).json({ error: 'No file uploaded' });
//             return;
//         }

//         const facultyData: any[] = [];
//         fs.createReadStream(file.path)
//             .pipe(csvParser())
//             .on('data', (row) => {
//                 facultyData.push(row);
//             })
//             .on('end', async () => {
//                 console.log('Parsed Faculty Data:', facultyData); // Debugging line

//                 try {
//                     // Insert data into the database
//                     for (const faculty of facultyData) {
//                         await prisma.faculty.create({
//                             data: {
//                                 name: faculty.name, // Add name directly to Faculty
//                                 email: faculty.email, // Add email directly to Faculty
//                                 department: faculty.department,
//                                 designation: faculty.designation,
//                                 user: {
//                                     create: {
//                                         name: faculty.name,
//                                         email: faculty.email,
//                                         role: 'faculty',
//                                         googleId: faculty.googleId || 'temp-' + Math.random().toString(36).substring(2, 15), // Generate a temporary ID if not provided
//                                     },
//                                 },
//                             },
//                         });
//                     }

//                     // Delete the file after processing
//                     fs.unlinkSync(file.path);

//                     res.json({ message: 'Faculty data uploaded successfully' });
//                 } catch (error) {
//                     next(error);
//                 }
//             });
//     } catch (error) {
//         next(error);
//     }
// };

// Upload Student CSV
// export const uploadStudentCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const file = req.file;
//         if (!file) {
//             res.status(400).json({ error: 'No file uploaded' });
//             return;
//         }

//         const studentData: any[] = [];
//         fs.createReadStream(file.path)
//             .pipe(csvParser())
//             .on('data', (row) => {
//                 studentData.push(row);
//             })
//             .on('end', async () => {
//                 try {
//                     // Insert data into the database
//                     for (const student of studentData) {
//                         await prisma.student.create({
//                             data: {
//                                 name: student.name, // Add name directly to Student
//                                 email: student.email, // Add email directly to Student
//                                 studentId: student.studentId,
//                                 batch: student.batch,
//                                 user: {
//                                     create: {
//                                         name: student.name,
//                                         email: student.email,
//                                         role: 'student',
//                                         googleId: student.googleId || 'temp-' + Math.random().toString(36).substring(2, 15), // Generate a temporary ID if not provided
//                                     },
//                                 },
//                             },
//                         });
//                     }

//                     // Delete the file after processing
//                     fs.unlinkSync(file.path);

//                     res.json({ message: 'Student data uploaded successfully' });
//                 } catch (error) {
//                     next(error);
//                 }
//             });
//     } catch (error) {
//         next(error);
//     }
// };

// export const uploadMiddleware = upload.single('file');