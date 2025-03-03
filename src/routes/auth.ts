import { Router } from "express";
import { auth } from "../controllers/auth";


const authRouter:Router = Router()

authRouter.get('/user/me', auth)

export default authRouter