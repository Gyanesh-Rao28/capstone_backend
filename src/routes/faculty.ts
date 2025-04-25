import { Router, RequestHandler } from "express";
import { getfacultyData } from "../controllers/faculty/faculty";
import { createAssessment, getAssessmentsByFaculty, gradeSubmission } from "../controllers/faculty/assessment";
import { isAuthenticated } from '../middlewares/google-auth';
import { postProject, updateProject, delProject } from "../controllers/faculty/faculty-project/projects";

import {
    getApplications,
    getApplicationById,
    reviewApplication
} from "../controllers/faculty/application-review";
import { getGroupById } from "../controllers/faculty/view-group";

const facultyRouter: Router = Router();

// get faculty data
// /api/faculty/
facultyRouter.get('/', getfacultyData as RequestHandler);


//  post, update, delete project
facultyRouter.post('/project', postProject as RequestHandler);
facultyRouter.put('/project/:projectId', updateProject as RequestHandler);
facultyRouter.delete('/project/:projectId', delProject as RequestHandler);


// Application Review
facultyRouter.get('/applications', getApplications as RequestHandler);
facultyRouter.get('/applications/:applicationId', getApplicationById as RequestHandler);
facultyRouter.put('/applications/:applicationId/review', reviewApplication as RequestHandler);

// view group by id
facultyRouter.get('/groups/:groupId', getGroupById as RequestHandler);

facultyRouter.post('/assessments', isAuthenticated, createAssessment as RequestHandler);
facultyRouter.get('/assessments', isAuthenticated, getAssessmentsByFaculty as RequestHandler);
facultyRouter.post('/submissions/grade', isAuthenticated, gradeSubmission as RequestHandler);

export default facultyRouter;