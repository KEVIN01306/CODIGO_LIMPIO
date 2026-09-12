import { Router } from "express";
import { authController } from "../auth.module.js";
import { ValidatedMiddleware } from "../../../app/middleware/Validated.middleware.js";
import { loginSchema } from "./validators/login.schema.js";
import { AuthMiddleware } from "../../../app/middleware/Auth.middleware.js";
const validatedMiddleware = new ValidatedMiddleware();
const authMiddleware = new AuthMiddleware();
const router = Router();
router.post('/login', validatedMiddleware.validateBody(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware.routeProtect, authController.getProfile);
router.post('/logout', authController.logout);
export default router;
//# sourceMappingURL=auth.routes.js.map