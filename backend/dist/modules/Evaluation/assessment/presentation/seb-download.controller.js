import { resolveSebConfiguration } from "../domain/resolve-seb-config.helper.js";
import AppError from "../../../../shared/errors/AppError.js";
export class SebDownloadController {
    sebJwtProvider;
    storageProvider;
    prisma;
    constructor(sebJwtProvider, storageProvider, prisma) {
        this.sebJwtProvider = sebJwtProvider;
        this.storageProvider = storageProvider;
        this.prisma = prisma;
    }
    downloadConfig = async (req, res, next) => {
        try {
            const token = req.query.token;
            if (!token) {
                throw new AppError("Missing SEB launch token query parameter", "TOKEN_REQUIRED", 400);
            }
            // 1. Cryptographically verify SEB JWT
            const payload = await this.sebJwtProvider.verifyToken(token);
            // 2. Validate relationships against database (Submission -> Assessment -> Student)
            const submission = await this.prisma.submission.findUnique({
                where: { id: payload.submissionId },
                include: {
                    assessment: {
                        include: {
                            offering: {
                                include: {
                                    campus: true
                                }
                            }
                        }
                    }
                }
            });
            if (!submission) {
                throw new AppError("Submission not found", "NOT_FOUND", 404);
            }
            if (submission.assessmentId !== payload.assessmentId) {
                throw new AppError("Token assessment mismatch with submission", "FORBIDDEN", 403);
            }
            if (submission.studentId !== payload.studentId) {
                throw new AppError("Token student mismatch with submission", "FORBIDDEN", 403);
            }
            // 3. Resolve SEB configuration (Assessment config takes precedence over Tenant default)
            const tenantId = submission.assessment.offering?.campus?.tenantId;
            const tenant = tenantId
                ? await this.prisma.tenant.findUnique({ where: { id: tenantId } })
                : null;
            const resolvedConfig = resolveSebConfiguration(submission.assessment, tenant);
            if (!resolvedConfig || !resolvedConfig.sebConfigUrl) {
                throw new AppError("SEB configuration not found or not configured", "SEB_CONFIG_NOT_FOUND", 404);
            }
            // 4. Retrieve .seb file from Cloudflare R2
            const r2Key = this.storageProvider.extractKeyFromUrl(resolvedConfig.sebConfigUrl);
            if (!r2Key) {
                throw new AppError("Invalid SEB configuration file path", "INVALID_FILE_PATH", 500);
            }
            const fileData = await this.storageProvider.getFile(r2Key);
            // 5. Send .seb binary response to Safe Exam Browser & set active submission cookie
            res.cookie("seb_active_submission_id", payload.submissionId, {
                maxAge: 30 * 60 * 1000, // 30 minutes
                httpOnly: false,
                sameSite: "lax",
                path: "/",
            });
            res.setHeader("Content-Type", "application/seb");
            res.setHeader("Content-Disposition", 'attachment; filename="config.seb"');
            res.setHeader("Content-Length", fileData.buffer.length);
            res.status(200).send(fileData.buffer);
            console.log("SEB configuration downloaded successfully", fileData);
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=seb-download.controller.js.map