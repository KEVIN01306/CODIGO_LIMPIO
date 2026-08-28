import { Router } from "express";
import { ErrorMiddleware } from "../app/middleware/Error.middleware.js";
import AuthRoutes from "../modules/Auth/presentation/auth.routes.js";
import UsersRoutes from "../modules/Users/presentation/users.routes.js";
import AuditRoutes from "../modules/Audit/presentation/audit.routes.js";
const router = Router();
router.use('/auth', AuthRoutes);
router.use('/users', UsersRoutes);
router.use('/audit', AuditRoutes);
router.use(ErrorMiddleware);
export default router;
//# sourceMappingURL=index.routes.js.map