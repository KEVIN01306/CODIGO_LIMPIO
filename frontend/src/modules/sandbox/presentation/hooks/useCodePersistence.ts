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
   * Removes the localStorage entry for this submission.
   * Call ONLY after the submission has been successfully finalized.
   */
  clearLocalSnapshot: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEBOUNCE_DELAY_MS = 3000;

const storageKey = (submissionId: string) =>
  `submission-code-snapshot:${submissionId}`;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useCodePersistence
 *
 * Dual-layer persistence for student code files:
 *
 *   Layer 1 — localStorage  (synchronous, immediate, survives browser refresh)
 *   Layer 2 — Backend API   (debounced 1.5s, survives device switches)
 *
 * Flow:
 *   files change → localStorage immediately → restart 1.5s debounce
 *   1.5s without change → PUT /submissions/:id/code with latest snapshot
 *
 * Stale-closure prevention:
 *   A `latestFilesRef` is updated synchronously so that the debounced
 *   callback always sends the most recent files, even if the closure captured
 *   an earlier version.
 *
 * AbortController:
 *   Each debounced request uses its own AbortController. When a new debounce
 *   fires before the previous request completes, the previous request is
 *   aborted so an older snapshot can never overwrite a newer one.
 */
export const useCodePersistence = ({
  submissionId,
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

  // ── Mount: check localStorage for a saved snapshot ──────────────────────
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    try {
      const raw = localStorage.getItem(storageKey(submissionId));
      if (raw) {
        const parsed: PersistedSnapshot = JSON.parse(raw);
        if (parsed?.files && typeof parsed.files === 'object') {
          onFilesRestored?.(parsed.files);
        }
      }
    } catch {
      // Silently ignore corrupt localStorage data — the backend snapshot
      // (already loaded by the parent page) serves as the fallback.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  // ── On every files change: persist to localStorage + restart debounce ───
  useEffect(() => {
    if (!submissionId) return;

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
      localStorage.setItem(storageKey(submissionId), JSON.stringify(snapshot));
      localStorage.setItem('submission-code-snapshot:latest', JSON.stringify(snapshot));
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

    // Cleanup: cancel timer when submissionId changes or component unmounts.
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, submissionId]);

  // ── Internal: send latest snapshot to the backend ───────────────────────
  const syncToBackend = useCallback(async () => {
    if (!submissionId) return;

    // Abort any previous in-flight request.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Read the latest files from the ref — NOT from the closure — to ensure
    // we never send a stale snapshot.
    const snapshot = latestFilesRef.current;

    try {
      await updateCodeSnapshot(submissionId, snapshot);

      // Only update status if this request wasn't superseded by a newer one.
      if (!controller.signal.aborted) {
        setStatus('saved');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        // Request was intentionally cancelled — a newer one is on the way.
        return;
      }
      if (!controller.signal.aborted) {
        setStatus('error');
        // localStorage still holds the latest data — no work is lost.
      }
    }
  }, [submissionId]);

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

  // ── clearLocalSnapshot: record submission flag without destroying code ───
  const clearLocalSnapshot = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey(submissionId));
      if (raw) {
        const parsed = JSON.parse(raw);
        localStorage.setItem(
          storageKey(submissionId),
          JSON.stringify({ ...parsed, submittedAt: new Date().toISOString() })
        );
      }
    } catch {
      // Ignore — not critical.
    }
  }, [submissionId]);

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

  return { status, flushAndSync, clearLocalSnapshot };
};
