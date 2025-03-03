import { Router, RequestHandler } from "express";
import { getfacultyData } from "../controllers/faculty/faculty";

import { postProject, updateProject, delProject } from "../controllers/faculty/faculty-project/projects";

const facultyRouter: Router = Router();


facultyRouter.get('/', getfacultyData as RequestHandler);


//  /api/faculty/project
facultyRouter.post('/project', postProject as RequestHandler);
facultyRouter.put('/project/:projectId', updateProject as RequestHandler);
facultyRouter.delete('/project/:projectId', delProject as RequestHandler);

export default facultyRouter;