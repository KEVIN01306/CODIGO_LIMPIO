export declare class CourseEnrollmentEntity {
    readonly id: string;
    readonly offeringId: string;
    readonly studentId: string;
    readonly status: string;
    readonly finalGrade: number | null;
    readonly enrolledAt: Date;
    readonly offering?: any | undefined;
    readonly student?: any | undefined;
    constructor(id: string, offeringId: string, studentId: string, status: string, finalGrade: number | null, enrolledAt: Date, offering?: any | undefined, student?: any | undefined);
}
//# sourceMappingURL=courseEnrollment.entity.d.ts.map