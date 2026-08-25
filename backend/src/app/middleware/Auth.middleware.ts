import type { Request, Response, NextFunction } from "express";
import JwtProvider from "@modules/Auth/domain/jwt.provider.js";
import AppError from "@shared/errors/AppError.js";

export class AuthMiddleware {
    private readonly jwtProvider: JwtProvider;

    constructor() {
        this.jwtProvider = new JwtProvider();
    }

    /**
     * Middleware principal para proteger rutas
     */
    public routeProtect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new AppError("Unauthorized: Token not provided", "UNAUTHORIZED", 401);
            }

            const token = authHeader.split(" ")[1];

            const payload = await this.jwtProvider.verifyToken(String(token));

            res.locals.user = {
                id: payload.sub,
                roles: payload.roles,
                permissions: payload.permissions,
            };

            (req as any).user = res.locals.user;

            next();
        } catch (error: any) {
            if (error.code === 'ERR_JWT_EXPIRED') {
                next(new AppError("the token has expired", "TOKEN_EXPIRED", 401));
                return;
            }

            if (error instanceof AppError) {
                next(error);
            } else {
                next(new AppError("Invalid Token", "INVALID_TOKEN", 401));
            }
        }
    };

    /**
     * Middleware opcional para validar roles (ADMIN)
     */
    public checkRole = (rolesPermitidos: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;

            if (!user || !user.roles.some((role: string) => rolesPermitidos.includes(role))) {
                return next(new AppError("Not authorized to perform this action", "FORBIDDEN", 403));
            }

            next();
        };
    };

    public checkPermission = (permissions: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;

            if (!user || !user.permissions) {
                return next(new AppError("Not authorized to perform this action", "FORBIDDEN", 403));
            }

            const hasAllPermissions = permissions.every((permission) =>
                user.permissions.includes(permission)
            );

            if (!hasAllPermissions) {
                return next(new AppError("Not authorized to perform this action", "FORBIDDEN", 403));
            }

            next();
        };
    };


    public checkPermissionSome = (permissions: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = (req as any).user;

            if (!user || !user.permissions) {
                return next(new AppError("Not authorized to perform this action", "FORBIDDEN", 403));
            }

            const hasSomePermissions = permissions.some((permission) =>
                user.permissions.includes(permission)
            );

            if (!hasSomePermissions) {
                return next(new AppError("Not authorized to perform this action", "FORBIDDEN", 403));
            }

            next();
        };
    };
}