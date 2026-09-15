import type { Request, Response, NextFunction } from "express";
import BaseController from "../../../presentation/base.controller.js";
import type { GetRolesMatrixUseCase } from "../application/get-roles-matrix.usecase.js";
export declare class RolesController extends BaseController {
    private readonly getRolesMatrixUseCase;
    constructor(getRolesMatrixUseCase: GetRolesMatrixUseCase);
    getMatrix: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=roles.controller.d.ts.map