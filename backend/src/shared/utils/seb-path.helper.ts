/**
 * Storage path helpers for Safe Exam Browser (.seb) configuration files in Cloudflare R2.
 */

export function sanitizeSebFileName(fileName: string): string {
    const base = fileName.split(/[/\\]/).pop() || "config.seb";
    let cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (cleaned.toLowerCase().endsWith(".seb")) {
        cleaned = cleaned.slice(0, -4) + ".seb";
    } else {
        cleaned = `${cleaned}.seb`;
    }
    return cleaned;
}

export function buildTenantSebPath(tenantId: string, fileName: string): string {
    const sanitized = sanitizeSebFileName(fileName);
    return `${tenantId}/tenant/${sanitized}`;
}

export function buildAssessmentSebPath(tenantId: string, assessmentId: string, fileName: string): string {
    const sanitized = sanitizeSebFileName(fileName);
    return `${tenantId}/assessments/${assessmentId}/${sanitized}`;
}
