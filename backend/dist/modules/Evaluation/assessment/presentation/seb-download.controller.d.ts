import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { StorageProvider } from "../../../../shared/domain/storage.provider.js";
import { SebJwtProvider } from "../../../../shared/infrastructure/seb-jwt.provider.js";
export declare class SebDownloadController {
    private readonly sebJwtProvider;
    private readonly storageProvider;
    private readonly prisma;
    constructor(sebJwtProvider: SebJwtProvider, storageProvider: StorageProvider, prisma: PrismaClient);
    downloadConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=seb-download.controller.d.ts.map