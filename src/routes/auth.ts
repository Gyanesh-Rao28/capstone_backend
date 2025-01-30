import { Router } from "express";
import { login } from "../controllers/auth";


const authRouter:Router = Router()

authRouter.get('/user/me', login)

export default authRouter