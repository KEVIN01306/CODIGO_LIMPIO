import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../../presentation/base.controller.js";
import type { CreateCohortUseCase } from "../../cohort/application/create-cohort.usecase.js";
import type { UpdateCohortUseCase } from "../../cohort/application/update-cohort.usecase.js";
import type { ListCohortsUseCase } from "../../cohort/application/list-cohort.usecase.js";
import type { GetCohortUseCase } from "../../cohort/application/get-cohort.usecase.js";
import type { DeleteCohortUseCase } from "../../cohort/application/delete-cohort.usecase.js";
export declare class CohortController extends BaseController {
    private readonly createCohortUseCase;
    private readonly updateCohortUseCase;
    private readonly listCohortsUseCase;
    private readonly getCohortUseCase;
    private readonly deleteCohortUseCase;
    constructor(createCohortUseCase: CreateCohortUseCase, updateCohortUseCase: UpdateCohortUseCase, listCohortsUseCase: ListCohortsUseCase, getCohortUseCase: GetCohortUseCase, deleteCohortUseCase: DeleteCohortUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=cohort.controller.d.ts.map