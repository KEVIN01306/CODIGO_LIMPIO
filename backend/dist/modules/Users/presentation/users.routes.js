import { Router } from "express";
import { usersController } from "../users.module.js";
import { AuthMiddleware } from "../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../app/middleware/Validated.middleware.js";
import { CreateUserSchema, UpdateUserSchema, UserIdSchema } from "./users.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
// Protect routes - requires authentication
router.use(authMiddleware.routeProtect);
router.get("/", usersController.list);
router.post("/", validatedMiddleware.validateBody(CreateUserSchema), usersController.create);
router.put("/:id", validatedMiddleware.validateParams(UserIdSchema), validatedMiddleware.validateBody(UpdateUserSchema), usersController.update);
router.patch("/:id/disable", validatedMiddleware.validateParams(UserIdSchema), usersController.disable);
router.delete("/:id", validatedMiddleware.validateParams(UserIdSchema), usersController.delete);
export default router;
//# sourceMappingURL=users.routes.js.map