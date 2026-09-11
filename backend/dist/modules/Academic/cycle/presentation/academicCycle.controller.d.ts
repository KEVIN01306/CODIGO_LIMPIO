import type { Request, Response, NextFunction } from "express";
import BaseController from "@presentation/base.controller.js";
import type { CreateAcademicCycleUseCase } from "../../cycle/application/create-academicCycle.usecase.js";
import type { UpdateAcademicCycleUseCase } from "../../cycle/application/update-academicCycle.usecase.js";
import type { ListAcademicCyclesUseCase } from "../../cycle/application/list-academicCycle.usecase.js";
import type { GetAcademicCycleUseCase } from "../../cycle/application/get-academicCycle.usecase.js";
import type { DeleteAcademicCycleUseCase } from "../../cycle/application/delete-academicCycle.usecase.js";
export declare class AcademicCycleController extends BaseController {
    private readonly createAcademicCycleUseCase;
    private readonly updateAcademicCycleUseCase;
    private readonly listAcademicCyclesUseCase;
    private readonly getAcademicCycleUseCase;
    private readonly deleteAcademicCycleUseCase;
    constructor(createAcademicCycleUseCase: CreateAcademicCycleUseCase, updateAcademicCycleUseCase: UpdateAcademicCycleUseCase, listAcademicCyclesUseCase: ListAcademicCyclesUseCase, getAcademicCycleUseCase: GetAcademicCycleUseCase, deleteAcademicCycleUseCase: DeleteAcademicCycleUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=academicCycle.controller.d.ts.map