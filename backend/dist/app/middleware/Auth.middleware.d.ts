import type { Request, Response, NextFunction } from "express";
export declare class AuthMiddleware {
    private readonly jwtProvider;
    constructor();
    /**
     * Middleware principal para proteger rutas
     */
    routeProtect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Middleware opcional para validar roles (ADMIN)
     */
    checkRole: (rolesPermitidos: string[]) => (req: Request, res: Response, next: NextFunction) => void;
    checkPermission: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => void;
    checkPermissionSome: (permissions: string[]) => (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=Auth.middleware.d.ts.map