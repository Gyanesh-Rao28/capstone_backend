import { RequestHandler, Router } from "express";
import {
    getAdminAnalytics,
    getAdminData,
    uploadFacultyCSV,
    uploadStudentCSV,
    uploadMiddleware,
} from "../controllers/admin/admin"
import { assignFacultyRole, assignStudentRole, assignAdminRole } from "../controllers/admin/roleAccess";
import { get } from "http";

const adminRouter:Router = Router()

adminRouter.get('/', getAdminData)

// assign Access Role
adminRouter.post('/assignFacultyRole', assignFacultyRole as RequestHandler)
adminRouter.post('/assignStudentRole', assignStudentRole as RequestHandler)
adminRouter.post('/assignAdminRole', assignAdminRole as RequestHandler)
adminRouter.get('/admin/data', getAdminData);
adminRouter.get('/admin/analytics', getAdminAnalytics);
adminRouter.post('/uploadFacultyCSV', uploadMiddleware, uploadFacultyCSV);
adminRouter.post('/uploadStudentCSV', uploadMiddleware, uploadStudentCSV);

export default adminRouter