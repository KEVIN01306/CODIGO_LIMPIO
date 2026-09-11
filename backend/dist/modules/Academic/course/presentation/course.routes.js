import { Router } from "express";
import { courseController } from "../../academic.module.js";
import { AuthMiddleware } from "../../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../../app/middleware/Validated.middleware.js";
import { CreateCourseSchema, UpdateCourseSchema, CourseIdSchema } from "./course.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["courses:read"]), courseController.list);
router.get("/:id", authMiddleware.checkPermission(["courses:read"]), validatedMiddleware.validateParams(CourseIdSchema), courseController.getById);
router.post("/", authMiddleware.checkPermission(["courses:create"]), validatedMiddleware.validateBody(CreateCourseSchema), courseController.create);
router.put("/:id", authMiddleware.checkPermission(["courses:update"]), validatedMiddleware.validateParams(CourseIdSchema), validatedMiddleware.validateBody(UpdateCourseSchema), courseController.update);
router.delete("/:id", authMiddleware.checkPermission(["courses:delete"]), validatedMiddleware.validateParams(CourseIdSchema), courseController.delete);
export default router;
//# sourceMappingURL=course.routes.js.map