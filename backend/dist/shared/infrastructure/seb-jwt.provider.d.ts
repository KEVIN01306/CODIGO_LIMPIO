export interface SebTokenPayload {
    submissionId: string;
    assessmentId: string;
    studentId: string;
}
export interface VerifiedSebTokenPayload extends SebTokenPayload {
    iat: number;
    exp: number;
}
export declare class SebJwtProvider {
    private readonly secret;
    constructor();
    /**
     * Signs a short-lived (3 minutes) SEB launch token containing submissionId, assessmentId, and studentId.
     */
    generateToken(payload: SebTokenPayload): Promise<string>;
    /**
     * Cryptographically verifies the SEB launch token signature, expiration, and required claims.
     */
    verifyToken(token: string): Promise<VerifiedSebTokenPayload>;
}
//# sourceMappingURL=seb-jwt.provider.d.ts.map