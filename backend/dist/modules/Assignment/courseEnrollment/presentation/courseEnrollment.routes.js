import { Router } from "express";
import { courseEnrollmentController } from "../../assignment.module.js";
import { AuthMiddleware } from "../../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../../app/middleware/Validated.middleware.js";
import { CreateCourseEnrollmentSchema, UpdateCourseEnrollmentSchema, CourseEnrollmentIdSchema } from "./courseEnrollment.schemas.js";
const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();
router.use(authMiddleware.routeProtect);
router.get("/", authMiddleware.checkPermission(["courseEnrollments:read"]), courseEnrollmentController.list);
router.get("/:id", authMiddleware.checkPermission(["courseEnrollments:read"]), validatedMiddleware.validateParams(CourseEnrollmentIdSchema), courseEnrollmentController.getById);
router.post("/", authMiddleware.checkPermission(["courseEnrollments:create"]), validatedMiddleware.validateBody(CreateCourseEnrollmentSchema), courseEnrollmentController.create);
router.put("/:id", authMiddleware.checkPermission(["courseEnrollments:update"]), validatedMiddleware.validateParams(CourseEnrollmentIdSchema), validatedMiddleware.validateBody(UpdateCourseEnrollmentSchema), courseEnrollmentController.update);
router.delete("/:id", authMiddleware.checkPermission(["courseEnrollments:delete"]), validatedMiddleware.validateParams(CourseEnrollmentIdSchema), courseEnrollmentController.delete);
export default router;
//# sourceMappingURL=courseEnrollment.routes.js.map