import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
import type { CreateAcademicProgramUseCase } from "../application/create-academicProgram.usecase.js";
import type { UpdateAcademicProgramUseCase } from "../application/update-academicProgram.usecase.js";
import type { ListAcademicProgramsUseCase } from "../application/list-academicProgram.usecase.js";
import type { GetAcademicProgramUseCase } from "../application/get-academicProgram.usecase.js";
import type { DeleteAcademicProgramUseCase } from "../application/delete-academicProgram.usecase.js";
export declare class AcademicProgramController extends BaseController {
    private readonly createAcademicProgramUseCase;
    private readonly updateAcademicProgramUseCase;
    private readonly listAcademicProgramsUseCase;
    private readonly getAcademicProgramUseCase;
    private readonly deleteAcademicProgramUseCase;
    constructor(createAcademicProgramUseCase: CreateAcademicProgramUseCase, updateAcademicProgramUseCase: UpdateAcademicProgramUseCase, listAcademicProgramsUseCase: ListAcademicProgramsUseCase, getAcademicProgramUseCase: GetAcademicProgramUseCase, deleteAcademicProgramUseCase: DeleteAcademicProgramUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=academicProgram.controller.d.ts.map