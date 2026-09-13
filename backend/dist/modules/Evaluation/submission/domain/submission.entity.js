export class SubmissionEntity {
    id;
    assessmentId;
    studentId;
    status;
    startedAt;
    submittedAt;
    tabSwitchesCount;
    clipboardAttempts;
    codeSnapshot;
    assessment;
    student;
    testsPassedScore;
    aiQualityScore;
    totalScore;
    testOutput;
    aiFeedback;
    chatHistory;
    constructor(id, assessmentId, studentId, status, startedAt, submittedAt, tabSwitchesCount, clipboardAttempts, codeSnapshot, assessment, student, testsPassedScore, aiQualityScore, totalScore, testOutput, aiFeedback, chatHistory) {
        this.id = id;
        this.assessmentId = assessmentId;
        this.studentId = studentId;
        this.status = status;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
        this.tabSwitchesCount = tabSwitchesCount;
        this.clipboardAttempts = clipboardAttempts;
        this.codeSnapshot = codeSnapshot;
        this.assessment = assessment;
        this.student = student;
        this.testsPassedScore = testsPassedScore;
        this.aiQualityScore = aiQualityScore;
        this.totalScore = totalScore;
        this.testOutput = testOutput;
        this.aiFeedback = aiFeedback;
        this.chatHistory = chatHistory;
    }
}
//# sourceMappingURL=submission.entity.js.map