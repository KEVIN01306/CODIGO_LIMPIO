export class CourseOfferingEntity {
    constructor(
        public readonly id: string,
        public readonly campusId: string,
        public readonly courseId: string,
        public readonly cycleId: string,
        public readonly teacherId: string | null,
        public readonly section: string,
        public readonly campus?: any,
        public readonly course?: any,
        public readonly cycle?: any,
        public readonly teacher?: any
    ) {}
}
