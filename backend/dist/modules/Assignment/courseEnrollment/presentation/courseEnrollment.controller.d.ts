import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../../presentation/base.controller.js";
import type { CreateCourseEnrollmentUseCase } from "../application/create-courseEnrollment.usecase.js";
import type { UpdateCourseEnrollmentUseCase } from "../application/update-courseEnrollment.usecase.js";
import type { ListCourseEnrollmentsUseCase } from "../application/list-courseEnrollment.usecase.js";
import type { GetCourseEnrollmentUseCase } from "../application/get-courseEnrollment.usecase.js";
import type { DeleteCourseEnrollmentUseCase } from "../application/delete-courseEnrollment.usecase.js";
export declare class CourseEnrollmentController extends BaseController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly listUseCase;
    private readonly getUseCase;
    private readonly deleteUseCase;
    constructor(createUseCase: CreateCourseEnrollmentUseCase, updateUseCase: UpdateCourseEnrollmentUseCase, listUseCase: ListCourseEnrollmentsUseCase, getUseCase: GetCourseEnrollmentUseCase, deleteUseCase: DeleteCourseEnrollmentUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=courseEnrollment.controller.d.ts.map