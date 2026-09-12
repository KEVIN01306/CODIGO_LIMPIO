import { EventEmitter } from 'events';

export interface SubmissionChatEvent {
  type: 'STUDENT_ASKED' | 'CHAT_UPDATED';
  submissionId: string;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  timestamp: string;
}

class SubmissionEventBusImpl {
  private readonly emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  private getChannel(submissionId: string): string {
    return `submission:${submissionId}`;
  }

  publish(event: SubmissionChatEvent): void {
    this.emitter.emit(this.getChannel(event.submissionId), event);
  }

  subscribe(submissionId: string, listener: (event: SubmissionChatEvent) => void): () => void {
    const channel = this.getChannel(submissionId);
    this.emitter.on(channel, listener);
    return () => {
      this.emitter.off(channel, listener);
    };
  }
}

export const submissionEventBus = new SubmissionEventBusImpl();
