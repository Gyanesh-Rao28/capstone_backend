import { RequestHandler, Router } from "express";
import {
    getAdminAnalytics,
    getAdminData,
    getAllUsers,
    // uploadFacultyCSV,
    // uploadStudentCSV,
    // uploadMiddleware,
} from "../controllers/admin/admin"
import { assignFacultyRole, assignStudentRole, assignAdminRole } from "../controllers/admin/roleAccess";

const adminRouter:Router = Router()

adminRouter.get('/', getAdminData)
adminRouter.get('/getAllusers', getAllUsers as RequestHandler)

// assign Access Role
adminRouter.post('/assignFacultyRole', assignFacultyRole as RequestHandler)
adminRouter.post('/assignStudentRole', assignStudentRole as RequestHandler)
adminRouter.post('/assignAdminRole', assignAdminRole as RequestHandler)
adminRouter.get('/admin/data', getAdminData);
adminRouter.get('/admin/analytics', getAdminAnalytics);
// adminRouter.post('/uploadFacultyCSV', uploadMiddleware, uploadFacultyCSV);
// adminRouter.post('/uploadStudentCSV', uploadMiddleware, uploadStudentCSV);

export default adminRouter