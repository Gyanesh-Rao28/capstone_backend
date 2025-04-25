import { Router, RequestHandler } from "express";

import { getStudent } from "../controllers/student/student";
import { createGroup, addGroupMember, leaveGroup, removeMember } from "../controllers/student/group";
import { applyToProject } from "../controllers/student/projectApplication";
import { uploadDocument } from "../controllers/student/submission/reportUpload";
import { upload } from "../middlewares/fileUpload";


const studentRouter: Router = Router();

// get student data
studentRouter.get('/', getStudent as RequestHandler);

// project group functionality

studentRouter.post('/createGroup', createGroup as RequestHandler);
studentRouter.put('/addGroupMember', addGroupMember as RequestHandler);
studentRouter.delete('/leaveGroup', leaveGroup as RequestHandler);
studentRouter.delete('/removeMember', removeMember as RequestHandler);

// create project application
studentRouter.post('/createApplication', applyToProject as RequestHandler);

// report file submission
studentRouter.post('/uploadReport', upload.single('report'), uploadDocument as RequestHandler);

export default studentRouter;