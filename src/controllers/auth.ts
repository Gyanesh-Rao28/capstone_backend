import { Request, Response } from "express"
import prisma from "../db"


export const login = async(req: Request, res: Response) => {

    const { googleId, email, name} = await req.body
    
    const user = await prisma.user.create({
        data:{
            googleId,
            email, 
            name
        }
    })

    res.json(user)

}
