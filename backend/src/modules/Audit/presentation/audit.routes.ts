import { Router } from "express";
import { auditController } from "../audit.module.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";

const router = Router();

const authMiddleware = new AuthMiddleware();

// Protect the route so only authenticated users (possibly only admins) can see the logs
router.use(authMiddleware.routeProtect);

router.get("/", auditController.list);

export default router;
