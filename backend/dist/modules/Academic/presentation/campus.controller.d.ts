import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
import type { CreateCampusUseCase } from "../application/create-campus.usecase.js";
import type { UpdateCampusUseCase } from "../application/update-campus.usecase.js";
import type { ListCampusesUseCase } from "../application/list-campus.usecase.js";
import type { GetCampusUseCase } from "../application/get-campus.usecase.js";
import type { DeleteCampusUseCase } from "../application/delete-campus.usecase.js";
export declare class CampusController extends BaseController {
    private readonly createCampusUseCase;
    private readonly updateCampusUseCase;
    private readonly listCampusesUseCase;
    private readonly getCampusUseCase;
    private readonly deleteCampusUseCase;
    constructor(createCampusUseCase: CreateCampusUseCase, updateCampusUseCase: UpdateCampusUseCase, listCampusesUseCase: ListCampusesUseCase, getCampusUseCase: GetCampusUseCase, deleteCampusUseCase: DeleteCampusUseCase);
    create: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    list: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=campus.controller.d.ts.map