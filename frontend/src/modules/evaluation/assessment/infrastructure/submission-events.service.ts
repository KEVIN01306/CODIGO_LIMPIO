import { useAuthStore } from '../../../../core/store/auth.store';
import { refreshAccessToken } from '../../../../core/api/axios.config';
import type { ChatMessage } from '../../../ai/domain/ai.types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SubmissionLiveEvent {
  type: 'CONNECTED' | 'STUDENT_ASKED' | 'CHAT_UPDATED';
  submissionId: string;
  chatHistory: ChatMessage[];
  timestamp?: string;
}

export const subscribeToSubmissionEvents = (
  submissionId: string,
  onEvent: (event: SubmissionLiveEvent) => void,
  onError?: (err: Error) => void
): (() => void) => {
  const abortController = new AbortController();
  let isCancelled = false;

  const connect = async () => {
    try {
      let token = useAuthStore.getState().accessToken;
      if (!token) {
        try {
          token = await refreshAccessToken();
        } catch {
          return;
        }
      }

      const url = `${BASE_URL}/evaluations/submissions/${submissionId}/events`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (!isCancelled) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.replace(/^data:\s*/, '');
          try {
            const eventData = JSON.parse(dataStr) as SubmissionLiveEvent;
            if (eventData && eventData.type && !isCancelled) {
              onEvent(eventData);
            }
          } catch {
            // Ignore keepalive / non-JSON packets
          }
        }
      }
    } catch (error: any) {
      if (!isCancelled && error.name !== 'AbortError' && onError) {
        onError(error);
      }
    }
  };

  connect();

  return () => {
    isCancelled = true;
    abortController.abort();
  };
};
