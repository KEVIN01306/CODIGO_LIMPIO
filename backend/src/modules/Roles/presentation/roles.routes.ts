import { Router } from "express";
import { rolesController } from "../roles.module.js";
import { AuthMiddleware } from "@app/middleware/Auth.middleware.js";

const router = Router();
const authMiddleware = new AuthMiddleware();

router.use(authMiddleware.routeProtect);

router.get(
    "/matrix",
    authMiddleware.checkPermission(["roles:read"]),
    rolesController.getMatrix
);

router.get(
    "/",
    authMiddleware.checkPermission(["roles:read"]),
    rolesController.getMatrix
);

export default router;
