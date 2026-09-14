import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage, WorkspaceContext } from '../../../ai/domain/ai.types';
import { streamMayeuticaChat } from '../../../ai/infrastructure/ai.service';

interface UseAIChatOptions {
  submissionId: string;
  initialHistory?: ChatMessage[] | null;
  currentCode: string;
  language: string;
  lastExecutionOutput?: string | null;
  exerciseGoal: string;
}

export const useAIChat = ({
  submissionId,
  initialHistory,
  currentCode,
  language,
  lastExecutionOutput,
  exerciseGoal,
}: UseAIChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastFailedPromptRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  // Initialize messages from Submission chatHistory on first load
  useEffect(() => {
    if (!initializedRef.current && initialHistory && Array.isArray(initialHistory) && initialHistory.length > 0) {
      setMessages(initialHistory);
      initializedRef.current = true;
    }
  }, [initialHistory]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (promptToUse?: string) => {
      const text = (promptToUse !== undefined ? promptToUse : inputValue).trim();
      if (!text || isLoading || !submissionId) return;

      // Reset error state
      setError(null);
      lastFailedPromptRef.current = null;

      // Clear input only if sending from active input
      if (promptToUse === undefined) {
        setInputValue('');
      }

      const userMessage: ChatMessage = { role: 'user', content: text };
      const currentHistorySnapshot = [...messages];

      // Optimistically add the student message and placeholder assistant message
      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: 'assistant', content: '' },
      ]);

      setIsLoading(true);
      setIsStreaming(false);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const workspaceContext: WorkspaceContext = {
        currentCode: currentCode || '',
        language: language || 'javascript',
        lastExecutionOutput: lastExecutionOutput || null,
        exerciseGoal: exerciseGoal || '',
      };
      console.log(workspaceContext);

      let accumulatedAssistantText = '';

      await streamMayeuticaChat({
        submissionId,
        payload: {
          studentPrompt: text,
          chatHistory: currentHistorySnapshot,
          workspaceContext,
        },
        signal: abortController.signal,
        onChunk: (chunk: string) => {
          setIsStreaming(true);
          accumulatedAssistantText += chunk;
          setMessages((prev) => {
            const copy = [...prev];
            const lastIndex = copy.length - 1;
            if (lastIndex >= 0 && copy[lastIndex].role === 'assistant') {
              copy[lastIndex] = {
                role: 'assistant',
                content: accumulatedAssistantText,
              };
            }
            return copy;
          });
        },
        onDone: (finalResponse: string, authoritativeHistory: ChatMessage[]) => {
          setIsLoading(false);
          setIsStreaming(false);
          abortControllerRef.current = null;

          if (authoritativeHistory && authoritativeHistory.length > 0) {
            setMessages(authoritativeHistory);
          } else {
            setMessages((prev) => {
              const copy = [...prev];
              const lastIndex = copy.length - 1;
              if (lastIndex >= 0 && copy[lastIndex].role === 'assistant') {
                copy[lastIndex] = {
                  role: 'assistant',
                  content: finalResponse || accumulatedAssistantText,
                };
              }
              return copy;
            });
          }
        },
        onError: (err: Error) => {
          setIsLoading(false);
          setIsStreaming(false);
          abortControllerRef.current = null;
          lastFailedPromptRef.current = text;
          setError(err.message || 'Mayéutica was unable to respond. Please try again.');

          // Remove the failed empty/incomplete assistant response so UI remains clean
          setMessages((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].role === 'assistant') {
              return prev.slice(0, -1);
            }
            return prev;
          });
        },
      });
    },
    [inputValue, isLoading, submissionId, messages, currentCode, language, lastExecutionOutput, exerciseGoal]
  );

  const retryLast = useCallback(() => {
    if (lastFailedPromptRef.current) {
      sendMessage(lastFailedPromptRef.current);
    }
  }, [sendMessage]);

  // Clean up any ongoing stream when unmounting
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isStreaming,
    error,
    clearError,
    sendMessage,
    retryLast,
  };
};
