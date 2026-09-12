import { useAuthStore } from '../../../core/store/auth.store';
import { refreshAccessToken } from '../../../core/api/axios.config';
import type { AiChatRequest, ChatMessage } from '../domain/ai.types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface StreamChatOptions {
  submissionId: string;
  payload: AiChatRequest;
  onChunk: (chunk: string) => void;
  onDone: (assistantResponse: string, updatedHistory: ChatMessage[]) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}

export const streamMayeuticaChat = async (options: StreamChatOptions): Promise<void> => {
  const { submissionId, payload, onChunk, onDone, onError, signal } = options;

  try {
    let token = useAuthStore.getState().accessToken;
    if (!token) {
      try {
        token = await refreshAccessToken();
      } catch (err) {
        throw new Error('Authentication required to use Mayéutica');
      }
    }

    const url = `${BASE_URL}/ai/submissions/${submissionId}/chat`;

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal,
    });

    // If 401, attempt refresh token once
    if (response.status === 401) {
      try {
        token = await refreshAccessToken();
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          signal,
        });
      } catch (refreshErr) {
        useAuthStore.getState().clearAuth();
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      let errorMessage = 'Failed to communicate with Mayéutica';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // use fallback message
      }
      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error('No response body returned from AI service');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedText = '';
    let finalChatHistory: ChatMessage[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep the last partial line in the buffer
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        try {
          const parsed = JSON.parse(dataStr);

          if (parsed.error) {
            throw new Error(parsed.error);
          }

          if (parsed.chunk) {
            accumulatedText += parsed.chunk;
            onChunk(parsed.chunk);
          }

          if (parsed.done) {
            accumulatedText = parsed.assistantResponse || accumulatedText;
            finalChatHistory = parsed.chatHistory || [];
          }
        } catch (parseErr: any) {
          if (parseErr.message && !parseErr.message.includes('JSON')) {
            throw parseErr;
          }
        }
      }
    }

    // Process any remaining bytes in buffer
    if (buffer.trim().startsWith('data:')) {
      const dataStr = buffer.trim().replace(/^data:\s*/, '');
      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.done) {
          accumulatedText = parsed.assistantResponse || accumulatedText;
          finalChatHistory = parsed.chatHistory || [];
        }
      } catch {
        // ignore incomplete tail
      }
    }

    onDone(accumulatedText, finalChatHistory);
  } catch (error: any) {
    if (signal?.aborted || error.name === 'AbortError') {
      // Stream was intentionally cancelled, do not trigger error feedback
      return;
    }
    console.error('[streamMayeuticaChat] Error:', error);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
};
