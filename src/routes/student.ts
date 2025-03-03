import { Router, RequestHandler } from "express";

import { getStudent } from "../controllers/student/student";

const studentRouter: Router = Router();


studentRouter.get('/', getStudent as RequestHandler);


export default studentRouter;