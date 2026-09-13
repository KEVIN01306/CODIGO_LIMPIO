export interface SubmissionChatEvent {
    type: 'STUDENT_ASKED' | 'CHAT_UPDATED' | 'SUBMISSION_GRADED' | 'SUBMISSION_EVALUATED';
    submissionId: string;
    chatHistory?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    totalScore?: number;
    feedback?: string;
    status?: string;
    timestamp: string;
}
declare class SubmissionEventBusImpl {
    private readonly emitter;
    constructor();
    private getChannel;
    publish(event: SubmissionChatEvent): void;
    subscribe(submissionId: string, listener: (event: SubmissionChatEvent) => void): () => void;
}
export declare const submissionEventBus: SubmissionEventBusImpl;
export {};
//# sourceMappingURL=submission-events.bus.d.ts.map