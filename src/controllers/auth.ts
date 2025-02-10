import { Request, Response } from "express";
import prisma from "../db";
import { UserType } from "../types";

interface RequestWithUser extends Request{
    user?: UserType
}

export const auth = async (req: RequestWithUser, res: Response) => {
    try {   
        // const user = req.user as UserType;

        const isAdmin = req.user?.role === "admin"
        const isfaculty = req.user?.role === "faculty"
        const isStudent = req.user?.role === "student"

        console.log(isAdmin, isfaculty, isStudent)
        
        const user:UserType | null = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            },
            include:{
                admin: isAdmin,
                faculty: isfaculty,
                student: isStudent
            }
        })

        console.log(user)

        res.json(user);
    } catch (error) {
        res.status(400).json({
            error: 'Failed to create user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }   
}