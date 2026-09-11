import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../../presentation/base.controller.js";
import type { CreateCourseOfferingUseCase } from "../application/create-courseOffering.usecase.js";
import type { UpdateCourseOfferingUseCase } from "../application/update-courseOffering.usecase.js";
import type { ListCourseOfferingsUseCase } from "../application/list-courseOffering.usecase.js";
import type { GetCourseOfferingUseCase } from "../application/get-courseOffering.usecase.js";
import type { DeleteCourseOfferingUseCase } from "../application/delete-courseOffering.usecase.js";
export declare class CourseOfferingController extends BaseController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly listUseCase;
    private readonly getUseCase;
    private readonly deleteUseCase;
    constructor(createUseCase: CreateCourseOfferingUseCase, updateUseCase: UpdateCourseOfferingUseCase, listUseCase: ListCourseOfferingsUseCase, getUseCase: GetCourseOfferingUseCase, deleteUseCase: DeleteCourseOfferingUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=courseOffering.controller.d.ts.map