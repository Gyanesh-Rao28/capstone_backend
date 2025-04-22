import { RequestHandler, Router } from "express";
import { getAdminData } from "../controllers/admin/admin";
import { assignFacultyRole, assignStudentRole, assignAdminRole } from "../controllers/admin/roleAccess";

const adminRouter:Router = Router()

adminRouter.get('/', getAdminData)

// assign Access Role
adminRouter.post('/assignFacultyRole', assignFacultyRole as RequestHandler)
adminRouter.post('/assignStudentRole', assignStudentRole as RequestHandler)
adminRouter.post('/assignAdminRole', assignAdminRole as RequestHandler)


export default adminRouter