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
    requireSeb;
    sebConfigKey;
    sebConfigFilePath;
    constructor(id, offeringId, title, type, maxScore, strictMode, description, weight, dueDate, timeLimitMinutes, allowedLanguage, createdAt, updatedAt, offering, // Can be typed fully if needed
    requireSeb = false, sebConfigKey, sebConfigFilePath) {
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
        this.requireSeb = requireSeb;
        this.sebConfigKey = sebConfigKey;
        this.sebConfigFilePath = sebConfigFilePath;
    }
}
//# sourceMappingURL=assessment.entity.js.map