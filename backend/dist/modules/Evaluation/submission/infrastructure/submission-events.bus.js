import { EventEmitter } from 'events';
class SubmissionEventBusImpl {
    emitter = new EventEmitter();
    constructor() {
        this.emitter.setMaxListeners(100);
    }
    getChannel(submissionId) {
        return `submission:${submissionId}`;
    }
    publish(event) {
        this.emitter.emit(this.getChannel(event.submissionId), event);
    }
    subscribe(submissionId, listener) {
        const channel = this.getChannel(submissionId);
        this.emitter.on(channel, listener);
        return () => {
            this.emitter.off(channel, listener);
        };
    }
}
export const submissionEventBus = new SubmissionEventBusImpl();
//# sourceMappingURL=submission-events.bus.js.map