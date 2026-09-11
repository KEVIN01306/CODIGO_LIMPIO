export declare class CourseOfferingEntity {
    readonly id: string;
    readonly campusId: string;
    readonly courseId: string;
    readonly cycleId: string;
    readonly teacherId: string | null;
    readonly section: string;
    readonly campus?: any | undefined;
    readonly course?: any | undefined;
    readonly cycle?: any | undefined;
    readonly teacher?: any | undefined;
    constructor(id: string, campusId: string, courseId: string, cycleId: string, teacherId: string | null, section: string, campus?: any | undefined, course?: any | undefined, cycle?: any | undefined, teacher?: any | undefined);
}
//# sourceMappingURL=courseOffering.entity.d.ts.map