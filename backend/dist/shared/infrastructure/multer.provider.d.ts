import type { Request, Response, NextFunction } from "express";
export declare class MulterUploadProvider {
    static single(fieldName?: string, required?: boolean): (req: Request, res: Response, next: NextFunction) => void;
    static seb(fieldName?: string, required?: boolean): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=multer.provider.d.ts.map