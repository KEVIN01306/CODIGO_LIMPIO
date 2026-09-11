export class CourseEnrollmentEntity {
    constructor(
        public readonly id: string,
        public readonly offeringId: string,
        public readonly studentId: string,
        public readonly status: string,
        public readonly finalGrade: number | null,
        public readonly enrolledAt: Date,
        public readonly offering?: any,
        public readonly student?: any
    ) {}
}
