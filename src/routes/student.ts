import { Router, RequestHandler } from "express";

import { getStudent } from "../controllers/student/student";
import { createGroup, addGroupMember, leaveGroup, removeMember } from "../controllers/student/group";
import { applyToProject, getAllApplication, getApplicationById } from "../controllers/student/projectApplication";
import { submitAssessment, getSubmissionsByStudent } from "../controllers/student/submission";
import { uploadDocument } from "../controllers/student/submission/reportUpload";
import { upload } from "../middlewares/fileUpload";
import { isAppliedForProject, isStudentInProject } from "../controllers/helper";

const studentRouter: Router = Router();

// get student data
studentRouter.get('/', getStudent as RequestHandler);

// project group functionality

studentRouter.get('/createGroup', createGroup as RequestHandler);
studentRouter.put('/addGroupMember', addGroupMember as RequestHandler);
studentRouter.delete('/leaveGroup', leaveGroup as RequestHandler);
studentRouter.delete('/removeMember', removeMember as RequestHandler);

// create project application
studentRouter.post('/createApplication', applyToProject as RequestHandler);
studentRouter.get('/getAllApplication', getAllApplication as RequestHandler);
studentRouter.get('/getApplicationById', getApplicationById as RequestHandler);

studentRouter.post("/submissions", submitAssessment as RequestHandler);
studentRouter.get("/submissions", getSubmissionsByStudent as RequestHandler);

// isMember
studentRouter.get("/isMember", isStudentInProject as RequestHandler);
studentRouter.get("/isAppliedForProject", isAppliedForProject as RequestHandler);

// report file submission
studentRouter.post('/uploadReport', upload.single('report'), uploadDocument as RequestHandler);

export default studentRouter;