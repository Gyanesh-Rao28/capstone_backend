import { Router } from "express";
import { getAdminData } from "../controllers/admin/admin";

const adminRouter:Router = Router()

adminRouter.get('/', getAdminData)

export default adminRouter