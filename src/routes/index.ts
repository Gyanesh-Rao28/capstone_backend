import { RequestHandler, Router } from "express";

import authRouter from "./auth";

// ADMIN
import adminRouter from "./admin";
import { AdminMiddleware } from "../middlewares/admin-auth";

// FACULTY
import { FacultyMiddleware } from "../middlewares/faculty-auth";
import facultyRouter from "./faculty";

// STUDENT
import { StudentMiddleware } from "../middlewares/student-auth";


// Authorized
import { getProject, getProjectById } from "../controllers/project";
import studentRouter from "./student";




const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/admin', AdminMiddleware, adminRouter)
rootRouter.use('/faculty', FacultyMiddleware, facultyRouter)
rootRouter.use('/student', StudentMiddleware, studentRouter)


//project
rootRouter.get('/projects', getProject as RequestHandler)
rootRouter.get('/project/:projectId', getProjectById as RequestHandler)


export default rootRouter