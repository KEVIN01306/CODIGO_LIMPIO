import type { LoginUseCase } from "../application/login.usecase.js";
import type { Request, Response, NextFunction } from "express";
import type { RefreshTokenUseCase } from "../application/refresh-token.usecase.js";
import type { GetProfileUseCase } from "../application/get-profile.usecase.js";
export declare class AuthController {
    private readonly loginUseCase;
    private readonly refreshTokenUseCase;
    private readonly getProfileUseCase;
    constructor(loginUseCase: LoginUseCase, refreshTokenUseCase: RefreshTokenUseCase, getProfileUseCase: GetProfileUseCase);
    login: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    refresh: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getProfile: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auth.controller.d.ts.map