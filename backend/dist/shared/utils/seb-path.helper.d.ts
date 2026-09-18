/**
 * Storage path helpers for Safe Exam Browser (.seb) configuration files in Cloudflare R2.
 */
export declare function sanitizeSebFileName(fileName: string): string;
export declare function buildTenantSebPath(tenantId: string, fileName: string): string;
export declare function buildAssessmentSebPath(tenantId: string, assessmentId: string, fileName: string): string;
//# sourceMappingURL=seb-path.helper.d.ts.map