import { Request, Response } from "express";
import prisma from "../db";
import { UserType } from "../types";

export const login = async (req: Request, res: Response) => {
    try {
        // const user = req.user as UserType;
        
        const user:UserType | null = await prisma.user.findFirst({
            where:{
                id: req.user?.id
            }
        })

        res.json(user);
    } catch (error) {
        res.status(400).json({
            error: 'Failed to create user',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }   
}