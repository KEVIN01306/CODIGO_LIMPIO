export class CourseOfferingEntity {
    id;
    campusId;
    courseId;
    cycleId;
    teacherId;
    section;
    campus;
    course;
    cycle;
    teacher;
    constructor(id, campusId, courseId, cycleId, teacherId, section, campus, course, cycle, teacher) {
        this.id = id;
        this.campusId = campusId;
        this.courseId = courseId;
        this.cycleId = cycleId;
        this.teacherId = teacherId;
        this.section = section;
        this.campus = campus;
        this.course = course;
        this.cycle = cycle;
        this.teacher = teacher;
    }
}
//# sourceMappingURL=courseOffering.entity.js.map