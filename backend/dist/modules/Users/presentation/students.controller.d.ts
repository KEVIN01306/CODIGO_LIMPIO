import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
export declare class StudentsController extends BaseController {
    private readonly createUseCase;
    private readonly updateUseCase;
    private readonly listUseCase;
    private readonly getUseCase;
    private readonly deleteUseCase;
    constructor(createUseCase: any, updateUseCase: any, listUseCase: any, getUseCase: any, deleteUseCase: any);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=students.controller.d.ts.map