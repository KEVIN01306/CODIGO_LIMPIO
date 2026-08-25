import { Router } from "express";
import { ErrorMiddleware } from "../app/middleware/Error.middleware.js";
const router = Router();
router.use(ErrorMiddleware);
export default router;
//# sourceMappingURL=index.routes.js.map