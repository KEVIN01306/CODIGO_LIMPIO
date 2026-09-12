import { useState, useRef, useCallback } from 'react';
import { runCode as runCodeService } from '../../infrastructure/submission.service';
import { toast } from 'react-toastify';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of the execution result returned by the backend. */
export interface CodeExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
}

export interface UseCodeExecutionParams {
  submissionId: string;
}

export interface UseCodeExecutionReturn {
  /**
   * Executes the given codeSnapshot on the backend.
   * Network/auth errors are handled here (toast); runtime errors go to `result`.
   *
   * @param files     - Current file map to send.
   * @param entryFile - The file path to use as the entry point.
   */
  execute: (files: Record<string, string>, entryFile: string) => Promise<void>;
  /** True while an execution request is in-flight. Prevents duplicate requests. */
  isRunning: boolean;
  /** The last execution result, or null if never executed / cleared. */
  result: CodeExecutionResult | null;
  /** Clears the last result (e.g. when the output panel is closed). */
  clearResult: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useCodeExecution
 *
 * Manages the "Run Code" lifecycle:
 *   - Calls the backend `POST /submissions/:id/run`.
 *   - Tracks loading state to prevent duplicate requests.
 *   - Stores the execution result for the Output component.
 *   - Distinguishes runtime errors (shown in Output) from API/network errors
 *     (shown via toast).
 *
 * The hook does NOT open or close the Output panel — that is the page's concern.
 */
export const useCodeExecution = ({
  submissionId,
}: UseCodeExecutionParams): UseCodeExecutionReturn => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);

  // Guard against starting a second execution before the first completes.
  const isRunningRef = useRef(false);

  const execute = useCallback(
    async (files: Record<string, string>, entryFile: string): Promise<void> => {
      if (isRunningRef.current) return; // Prevent duplicates.
      if (!submissionId) return;

      isRunningRef.current = true;
      setIsRunning(true);

      try {
        // The service calls the centralized axios instance — no raw fetch.
        const data = await runCodeService(submissionId, files, entryFile);

        // Runtime errors (bad exit code, exceptions) come back as part of the
        // 200 response. They are stored in `result` for the Output panel.
        setResult(data as CodeExecutionResult);
      } catch (err: any) {
        // Network / auth / server errors — NOT runtime errors.
        // Display via toast (existing error convention); do not touch `result`.
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to execute code. Please try again.';
        toast.error(message);
      } finally {
        setIsRunning(false);
        isRunningRef.current = false;
      }
    },
    [submissionId]
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { execute, isRunning, result, clearResult };
};
