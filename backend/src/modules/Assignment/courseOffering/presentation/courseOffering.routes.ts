import { Router } from "express";
import { courseOfferingController } from "../../assignment.module.js";
import { AuthMiddleware } from "../../../../app/middleware/Auth.middleware.js";
import { ValidatedMiddleware } from "../../../../app/middleware/Validated.middleware.js";
import { CreateCourseOfferingSchema, UpdateCourseOfferingSchema, CourseOfferingIdSchema } from "./courseOffering.schemas.js";

const router = Router();
const authMiddleware = new AuthMiddleware();
const validatedMiddleware = new ValidatedMiddleware();

router.use(authMiddleware.routeProtect);

router.get("/", authMiddleware.checkPermission(["courseOfferings:read"]), courseOfferingController.list);
router.get("/:id", authMiddleware.checkPermission(["courseOfferings:read"]), validatedMiddleware.validateParams(CourseOfferingIdSchema), courseOfferingController.getById);
router.post("/", authMiddleware.checkPermission(["courseOfferings:create"]), validatedMiddleware.validateBody(CreateCourseOfferingSchema), courseOfferingController.create);
router.put("/:id", authMiddleware.checkPermission(["courseOfferings:update"]), validatedMiddleware.validateParams(CourseOfferingIdSchema), validatedMiddleware.validateBody(UpdateCourseOfferingSchema), courseOfferingController.update);
router.delete("/:id", authMiddleware.checkPermission(["courseOfferings:delete"]), validatedMiddleware.validateParams(CourseOfferingIdSchema), courseOfferingController.delete);

export default router;
