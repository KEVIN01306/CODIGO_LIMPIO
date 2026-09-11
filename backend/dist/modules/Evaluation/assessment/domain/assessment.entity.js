export class AssessmentEntity {
    id;
    offeringId;
    title;
    type;
    maxScore;
    strictMode;
    description;
    weight;
    dueDate;
    timeLimitMinutes;
    allowedLanguage;
    createdAt;
    updatedAt;
    offering;
    constructor(id, offeringId, title, type, maxScore, strictMode, description, weight, dueDate, timeLimitMinutes, allowedLanguage, createdAt, updatedAt, offering // Can be typed fully if needed
    ) {
        this.id = id;
        this.offeringId = offeringId;
        this.title = title;
        this.type = type;
        this.maxScore = maxScore;
        this.strictMode = strictMode;
        this.description = description;
        this.weight = weight;
        this.dueDate = dueDate;
        this.timeLimitMinutes = timeLimitMinutes;
        this.allowedLanguage = allowedLanguage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.offering = offering;
    }
}
//# sourceMappingURL=assessment.entity.js.map