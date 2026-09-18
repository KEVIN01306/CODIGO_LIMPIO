import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError.js";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

const ALLOWED_MIME_TYPES = new Set([
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
    // Video & Audio
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    // Archives
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-tar",
    "application/gzip",
    // Safe Exam Browser
    "application/seb"
]);

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
    },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError(`Unsupported file type: ${file.mimetype}. Allowed types include images, PDFs, documents, audio and video.`, "INVALID_FILE_TYPE", 400));
        }
    },
});

export class MulterUploadProvider {
    static single(fieldName: string = "file", required: boolean = true) {
        const uploader = upload.single(fieldName);

        return (req: Request, res: Response, next: NextFunction) => {
            uploader(req, res, (err: any) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === "LIMIT_FILE_SIZE") {
                            return next(new AppError(`File exceeds maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`, "FILE_TOO_LARGE", 400));
                        }
                        return next(new AppError(`File upload error: ${err.message}`, "FILE_UPLOAD_ERROR", 400));
                    }
                    return next(err);
                }

                if (required && !req.file) {
                    return next(new AppError("A file is required for this operation", "FILE_REQUIRED", 400));
                }

                next();
            });
        };
    }

    static seb(fieldName: string = "file", required: boolean = false) {
        const uploader = upload.fields([
            { name: fieldName, maxCount: 1 },
            { name: "sebConfigFile", maxCount: 1 },
            { name: "file", maxCount: 1 },
        ]);

        return (req: Request, res: Response, next: NextFunction) => {
            uploader(req, res, (err: any) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === "LIMIT_FILE_SIZE") {
                            return next(new AppError(`File exceeds maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`, "FILE_TOO_LARGE", 400));
                        }
                        return next(new AppError(`File upload error: ${err.message}`, "FILE_UPLOAD_ERROR", 400));
                    }
                    return next(err);
                }

                const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
                if (files) {
                    req.file = files[fieldName]?.[0] || files["sebConfigFile"]?.[0] || files["file"]?.[0];
                }

                if (required && !req.file) {
                    return next(new AppError("A .seb configuration file is required", "FILE_REQUIRED", 400));
                }

                if (req.file) {
                    const originalName = req.file.originalname.toLowerCase();
                    if (!originalName.endsWith(".seb")) {
                        return next(new AppError("Only .seb files are allowed.", "INVALID_FILE_EXTENSION", 400));
                    }
                    if (req.file.mimetype !== "application/seb") {
                        return next(new AppError("Invalid MIME type. Expected application/seb.", "INVALID_MIME_TYPE", 400));
                    }
                }

                next();
            });
        };
    }
}
