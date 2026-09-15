import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
import type { GetSebConfigUseCase } from "../application/get-seb-config.usecase.js";
import type { UpdateSebConfigUseCase } from "../application/update-seb-config.usecase.js";
export declare class SebConfigController extends BaseController {
    private readonly getSebConfigUseCase;
    private readonly updateSebConfigUseCase;
    constructor(getSebConfigUseCase: GetSebConfigUseCase, updateSebConfigUseCase: UpdateSebConfigUseCase);
    getSebConfig: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateSebConfig: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=seb-config.controller.d.ts.map