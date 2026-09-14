import { useEffect, useRef, useCallback, useState } from 'react';
import { updateCodeSnapshot } from '../../infrastructure/submission.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PersistenceStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * The shape stored in localStorage for each submission.
 * Includes an `updatedAt` timestamp so we can compare with backend data
 * if we ever need to resolve conflicts across devices.
 */
export interface PersistedSnapshot {
  files: Record<string, string>;
  updatedAt: string;
}

export interface UseCodePersistenceParams {
  /** The active submission ID — used to namespace the localStorage key. */
  submissionId: string;
  /** Optional user ID for student user isolation across multi-user browsers. */
  userId?: string;
  /** Current file map from React state. The hook watches this for changes. */
  files: Record<string, string>;
  /**
   * Called once on mount if a valid local snapshot is found in localStorage.
   * The parent page should use this to restore the editor's file state.
   */
  onFilesRestored?: (files: Record<string, string>) => void;
}

export interface UseCodePersistenceReturn {
  /** Current synchronization status with the backend. */
  status: PersistenceStatus;
  /**
   * Cancels any pending debounce and immediately persists the latest snapshot
   * to the backend. Returns a Promise so callers can `await` it before
   * performing final operations (e.g. finishSubmission).
   */
  flushAndSync: () => Promise<void>;
  /**
   * Removes all temporary localStorage entries belonging to this submission sequentially.
   * Call ONLY after the submission has been successfully finalized or when leaving the assessment.
   */
  clearLocalSnapshot: () => void;
  /** Alias for clearLocalSnapshot following standard terminology. */
  clearLocalFiles: () => void;
}

// ─── Constants & Key Helpers ──────────────────────────────────────────────────

const DEBOUNCE_DELAY_MS = 3000;

export const getStorageKeyPrefix = (submissionId: string, userId?: string): string => {
  return userId ? `${userId}:${submissionId}` : submissionId;
};

export const getSnapshotKey = (submissionId: string, userId?: string): string => {
  return `submission-code-snapshot:${getStorageKeyPrefix(submissionId, userId)}`;
};

export const getFileKey = (submissionId: string, filePath: string, userId?: string): string => {
  return `sandbox-file:${getStorageKeyPrefix(submissionId, userId)}:${filePath}`;
};

export const getSessionMarkerKey = (submissionId: string): string => {
  return `sandbox-session-active:${submissionId}`;
};

// ─── Session Marker Helpers ───────────────────────────────────────────────────

/**
 * Checks whether this tab has an active in-flight session for this submission.
 * sessionStorage survives browser refresh (F5), but is absent for new tabs / re-entries.
 */
export const isAssessmentSessionActive = (submissionId: string): boolean => {
  if (!submissionId) return false;
  try {
    return sessionStorage.getItem(getSessionMarkerKey(submissionId)) === 'true';
  } catch {
    return false;
  }
};

export const setAssessmentSessionActive = (submissionId: string): void => {
  if (!submissionId) return;
  try {
    sessionStorage.setItem(getSessionMarkerKey(submissionId), 'true');
  } catch {
    // Ignore storage quota / private browsing errors
  }
};

export const clearAssessmentSessionActive = (submissionId: string): void => {
  if (!submissionId) return;
  try {
    sessionStorage.removeItem(getSessionMarkerKey(submissionId));
  } catch {
    // Ignore errors
  }
};

// ─── Centralized LocalStorage Cleanup ─────────────────────────────────────────

/**
 * Identifies and removes all localStorage keys belonging specifically to the given submission.
 * Deletions are performed sequentially. Unrelated keys, other submissions, other assessments,
 * auth state, and theme settings are never touched.
 *
 * @returns Array of keys that were removed.
 */
export const clearSubmissionLocalStorage = (submissionId: string, userId?: string): string[] => {
  if (!submissionId) return [];

  const keysToRemove: string[] = [];

  try {
    const totalKeys = localStorage.length;
    for (let i = 0; i < totalKeys; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Check if key belongs to this submission
      const isSnapshotKey = key.startsWith('submission-code-snapshot:') && key.includes(submissionId);
      const isFileKey =
        (key.startsWith('sandbox-file:') || key.startsWith('submission-file:')) &&
        key.includes(submissionId);
      const isLegacyFilesKey = key.startsWith('sandbox-files:') && key.includes(submissionId);

      if (isSnapshotKey || isFileKey || isLegacyFilesKey) {
        // Multi-user safety: if userId is provided, ensure we don't clear another user's key
        // Keys formatted as `${prefix}:${userId}:${submissionId}...`
        if (userId) {
          const parts = key.split(':');
          // If the key explicitly has a userId field and it doesn't match our userId, skip it
          if (parts.length >= 3 && parts[1] !== submissionId && parts[1] !== userId) {
            continue;
          }
        }
        keysToRemove.push(key);
      }
    }

    // Also clean up any un-scoped legacy fallback key if it exists
    if (localStorage.getItem('submission-code-snapshot:latest') !== null) {
      keysToRemove.push('submission-code-snapshot:latest');
    }

    // Sequentially remove each key one-by-one
    for (let i = 0; i < keysToRemove.length; i++) {
      localStorage.removeItem(keysToRemove[i]);
    }
  } catch (e) {
    console.warn('Failed to clear submission localStorage keys:', e);
  }

  return keysToRemove;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useCodePersistence
 *
 * Dual-layer persistence for student code files:
 *
 *   Layer 1 — localStorage  (synchronous, immediate, scoped to submission + user)
 *   Layer 2 — Backend API   (debounced 3.0s, survives device switches)
 *
 * Flow:
 *   files change → localStorage immediately (snapshot + sequential file entries)
 *               → restart 3.0s debounce
 *   3.0s without change → PUT /submissions/:id/code with latest snapshot
 *
 * Lifecycle & Cleanup:
 *   - On mount: checks localStorage for saved snapshot (if active session).
 *   - On flushAndSync: cancels debounce and immediately sends latest snapshot to backend.
 *   - On clearLocalSnapshot: cancels debounce, aborts in-flight requests, marks hook as
 *     cleaned up, and removes all submission localStorage keys sequentially.
 */
export const useCodePersistence = ({
  submissionId,
  userId,
  files,
  onFilesRestored,
}: UseCodePersistenceParams): UseCodePersistenceReturn => {
  const [status, setStatus] = useState<PersistenceStatus>('idle');

  // Always holds the latest files to avoid stale closures inside the debounce.
  const latestFilesRef = useRef<Record<string, string>>(files);

  // Debounce timer ref so we can cancel it on every new keystroke.
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AbortController for the current in-flight request.
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track whether this is the first render (to run the restore logic once).
  const hasRestoredRef = useRef(false);

  // Guard flag: once cleaned up (submitted or left), prevent any subsequent writes.
  const isCleanedUpRef = useRef(false);

  // Track previously stored individual file keys so we can remove deleted files.
  const trackedFileKeysRef = useRef<Set<string>>(new Set());

  // ── Mount: check localStorage for a saved snapshot ──────────────────────
  useEffect(() => {
    if (hasRestoredRef.current || !submissionId) return;
    hasRestoredRef.current = true;

    try {
      // Check user-scoped key first, then fallback to unscoped key
      const scopedKey = getSnapshotKey(submissionId, userId);
      const fallbackKey = getSnapshotKey(submissionId);
      const raw = localStorage.getItem(scopedKey) || localStorage.getItem(fallbackKey);
      if (raw) {
        const parsed: PersistedSnapshot = JSON.parse(raw);
        if (parsed?.files && typeof parsed.files === 'object' && Object.keys(parsed.files).length > 0) {
          onFilesRestored?.(parsed.files);
        }
      }
    } catch {
      // Silently ignore corrupt localStorage data — the backend snapshot
      // (already loaded by the parent page) serves as the authoritative fallback.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId, userId]);

  // ── Internal: send latest snapshot to the backend ───────────────────────
  const syncToBackend = useCallback(async () => {
    if (!submissionId || isCleanedUpRef.current) return;

    // Abort any previous in-flight request.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Read latest files from the ref to ensure freshest data is sent.
    const snapshot = latestFilesRef.current;

    try {
      await updateCodeSnapshot(submissionId, snapshot);

      // Only update status if this request wasn't superseded or cleaned up.
      if (!controller.signal.aborted && !isCleanedUpRef.current) {
        setStatus('saved');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        // Request was intentionally cancelled — a newer one is on the way.
        return;
      }
      if (!controller.signal.aborted && !isCleanedUpRef.current) {
        setStatus('error');
      }
    }
  }, [submissionId]);

  // ── On every files change: persist to localStorage + restart debounce ───
  useEffect(() => {
    if (!submissionId || isCleanedUpRef.current) return;

    // CRITICAL: Do NOT write empty files object to localStorage,
    // which would destroy saved code before initial load or fetch completes!
    if (Object.keys(files).length === 0) return;

    // 1. Always keep the ref up-to-date to prevent stale closures.
    latestFilesRef.current = files;

    // 2. Immediately persist to localStorage in real-time.
    try {
      const snapshot: PersistedSnapshot = {
        files,
        updatedAt: new Date().toISOString(),
      };

      // Save submission-scoped snapshot
      localStorage.setItem(getSnapshotKey(submissionId, userId), JSON.stringify(snapshot));

      // Save each file individually under scoped key for sequential file operations
      const currentKeys = new Set<string>();
      for (const [filePath, content] of Object.entries(files)) {
        const fileKey = getFileKey(submissionId, filePath, userId);
        currentKeys.add(fileKey);
        localStorage.setItem(fileKey, content);
      }

      // Remove any individual file keys that were deleted from the files map
      for (const oldKey of trackedFileKeysRef.current) {
        if (!currentKeys.has(oldKey)) {
          localStorage.removeItem(oldKey);
        }
      }
      trackedFileKeysRef.current = currentKeys;
    } catch (e) {
      console.warn('Failed to save code to localStorage:', e);
    }

    // 3. Cancel the previous debounce timer.
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    // 4. Start a new debounce timer for backend sync (3 seconds).
    setStatus('saving');
    debounceTimerRef.current = setTimeout(() => {
      syncToBackend();
    }, DEBOUNCE_DELAY_MS);

    // Cleanup: cancel timer when submissionId/files change or component unmounts.
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, submissionId, userId, syncToBackend]);

  // ── flushAndSync: cancel debounce and force an immediate sync ───────────
  const flushAndSync = useCallback(async (): Promise<void> => {
    // Cancel any pending timer.
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Force a synchronous backend save with the latest files.
    await syncToBackend();
  }, [syncToBackend]);

  // ── clearLocalSnapshot: delete submission localStorage sequentially ─────
  const clearLocalSnapshot = useCallback(() => {
    // Mark as cleaned up to stop any future writes
    isCleanedUpRef.current = true;

    // Cancel any pending debounce timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Abort in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Centralized sequential cleanup of all keys for this submission
    clearSubmissionLocalStorage(submissionId, userId);
    clearAssessmentSessionActive(submissionId);
    trackedFileKeysRef.current.clear();
  }, [submissionId, userId]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    status,
    flushAndSync,
    clearLocalSnapshot,
    clearLocalFiles: clearLocalSnapshot,
  };
};

