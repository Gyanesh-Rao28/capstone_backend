import { Router, RequestHandler } from "express";

import { getStudent } from "../controllers/student/student";
import { createGroup, addGroupMember, leaveGroup, removeMember } from "../controllers/student/group";


const studentRouter: Router = Router();

// get student data
studentRouter.get('/', getStudent as RequestHandler);

// project group functionality

studentRouter.post('/createGroup', createGroup as RequestHandler);
studentRouter.put('/addGroupMember', addGroupMember as RequestHandler);
studentRouter.delete('/leaveGroup', leaveGroup as RequestHandler);
studentRouter.delete('/removeMember', removeMember as RequestHandler);

// create project application

export default studentRouter;