import { Router, RequestHandler } from "express";

import { getStudent } from "../controllers/student/student";
import { createGroup, addGroupMember } from "../controllers/student/group";


const studentRouter: Router = Router();

// get student data
studentRouter.get('/', getStudent as RequestHandler);

// project group functionality

studentRouter.post('/createGroup', createGroup as RequestHandler);
studentRouter.put('/addGroupMember', addGroupMember as RequestHandler);

export default studentRouter;