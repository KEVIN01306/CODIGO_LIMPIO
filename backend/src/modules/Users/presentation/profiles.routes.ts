import { Router } from "express";
import { listTeachers, listStudents } from "./profiles.controller.js";
import { AuthMiddleware } from "../../../app/middleware/Auth.middleware.js";

const router = Router();
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.routeProtect);

router.get("/teachers", listTeachers);
router.get("/students", listStudents);

export default router;
