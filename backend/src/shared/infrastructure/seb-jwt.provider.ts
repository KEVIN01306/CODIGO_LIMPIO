import { SignJWT, jwtVerify } from 'jose';
import AppError from '../errors/AppError.js';

export interface SebTokenPayload {
    submissionId: string;
    assessmentId: string;
    studentId: string;
}

export interface VerifiedSebTokenPayload extends SebTokenPayload {
    iat: number;
    exp: number;
}

export class SebJwtProvider {
    private readonly secret: Uint8Array;

    constructor() {
        const secretStr = process.env.SEB_JWT_SECRET;
        if (!secretStr) {
            throw new AppError('SEB_JWT_SECRET environment variable is not configured', 'MISSING_ENV_VARS', 500);
        }
        this.secret = new TextEncoder().encode(secretStr);
    }

    /**
     * Signs a short-lived (3 minutes) SEB launch token containing submissionId, assessmentId, and studentId.
     */
    async generateToken(payload: SebTokenPayload): Promise<string> {
        return await new SignJWT({
            submissionId: payload.submissionId,
            assessmentId: payload.assessmentId,
            studentId: payload.studentId,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('3m')
            .sign(this.secret);
    }

    /**
     * Cryptographically verifies the SEB launch token signature, expiration, and required claims.
     */
    async verifyToken(token: string): Promise<VerifiedSebTokenPayload> {
        try {
            const { payload } = await jwtVerify(token, this.secret);

            const submissionId = payload.submissionId as string | undefined;
            const assessmentId = payload.assessmentId as string | undefined;
            const studentId = payload.studentId as string | undefined;
            const iat = payload.iat;
            const exp = payload.exp;

            if (!submissionId || !assessmentId || !studentId || !iat || !exp) {
                throw new AppError('Invalid SEB launch token: missing required claims', 'INVALID_SEB_TOKEN', 401);
            }

            return {
                submissionId,
                assessmentId,
                studentId,
                iat,
                exp,
            };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error?.code === 'ERR_JWT_EXPIRED') {
                throw new AppError('The SEB launch token has expired', 'SEB_TOKEN_EXPIRED', 401);
            }
            throw new AppError('Invalid or tampered SEB launch token', 'INVALID_SEB_TOKEN', 401);
        }
    }
}
