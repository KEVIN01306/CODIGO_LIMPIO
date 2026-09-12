import React, { useEffect, useState, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { getSubmissionById, syncSubmission, finishSubmission } from '../../infrastructure/submission.service';
import { parseCodeSnapshot } from '../../sandbox.utils';

import { useSandboxFiles } from '../hooks/useSandboxFiles';
import { useCodePersistence } from '../hooks/useCodePersistence';
import { useCodeExecution } from '../hooks/useCodeExecution';

import SandboxToolbar from '../components/SandboxToolbar.component';
import SandboxFileTree from '../components/SandboxFileTree.component';
import SandboxCodeEditor from '../components/SandboxCodeEditor.component';
import SandboxOutput from '../components/SandboxOutput.component';
import SandboxSubmitDialog from '../components/SandboxSubmitDialog.component';
import SandboxWarningDialog from '../components/SandboxWarningDialog.component';
import SandboxAIChat from '../components/SandboxAIChat.component';

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * SandboxEditor (page)
 *
 * Orchestrates the sandbox experience. Responsibilities here:
 *   - Load submission metadata.
 *   - Coordinate file state, persistence, and execution hooks.
 *   - Handle anti-cheat events.
 *   - Connect components via props/callbacks.
 *
 * All UI rendering is delegated to focused components.
 * All API calls are delegated to hooks and services.
 */
const SandboxEditor: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  // ── Submission metadata ──────────────────────────────────────────────────
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── UI dialogs ───────────────────────────────────────────────────────────
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [outputOpen, setOutputOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);

  // ── Anti-cheat counters ──────────────────────────────────────────────────
  const [tabSwitches, setTabSwitches] = useState(0);
  const [clipboardAttempts, setClipboardAttempts] = useState(0);

  // ── Hooks ────────────────────────────────────────────────────────────────
  const {
    files, selectedFile,
    setFiles, setSelectedFile,
    updateFileContent, selectFile,
    createFile, createFolder, deleteFile,
    deleteFolder, moveFile,
  } = useSandboxFiles();

  const { status: persistenceStatus, flushAndSync, clearLocalSnapshot } = useCodePersistence({
    submissionId: submissionId ?? '',
    files,
    onFilesRestored: (restoredFiles) => {
      setFiles(restoredFiles);
      const first = Object.keys(restoredFiles)[0];
      if (first) setSelectedFile(first);
    },
  });

  const { execute: runCodeExecute, isRunning, result: executionResult } = useCodeExecution({
    submissionId: submissionId ?? '',
  });

  // Flag to ignore blur events triggered around Cmd+S / Ctrl+S
  const recentSaveShortcutRef = useRef(false);

  // ── Initial Load ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!submissionId) return;
    getSubmissionById(submissionId)
      .then((data) => {
        if (data.status !== 'IN_PROGRESS') {
          toast.warning('This assessment has already been submitted or flagged.');
          navigate(-1);
          return;
        }
        setSubmission(data);
        setTabSwitches(data.tabSwitchesCount || 0);
        setClipboardAttempts(data.clipboardAttempts || 0);

        // Check if there is an active local snapshot in localStorage
        const lang = data.assessment?.allowedLanguage || 'javascript';
        const parsedBackend = parseCodeSnapshot(data.codeSnapshot, lang);
        let effectiveFiles = parsedBackend;

        try {
          const raw = localStorage.getItem(`submission-code-snapshot:${submissionId}`) ||
                      localStorage.getItem('submission-code-snapshot:latest');
          if (raw) {
            const parsedLocal = JSON.parse(raw);
            if (parsedLocal?.files && typeof parsedLocal.files === 'object' && Object.keys(parsedLocal.files).length > 0) {
              effectiveFiles = parsedLocal.files;
            }
          }
        } catch (e) {
          console.warn('Could not parse localStorage snapshot:', e);
        }

        setFiles(effectiveFiles);
        setSelectedFile(Object.keys(effectiveFiles)[0] ?? '');
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load assessment data.');
        navigate(-1);
      });
  }, [submissionId, navigate]);

  // ── Anti-cheat ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !submission?.assessment?.strictMode) return;

    const warn = (msg: string) => {
      setWarningMessage(msg);
      setWarningOpen(true);
    };

    const syncInfractions = (tabs: number, clips: number) => {
      if (!submissionId) return;
      syncSubmission(submissionId, { tabSwitchesCount: tabs, clipboardAttempts: clips })
        .catch(console.error);
    };

    const handleBlur = () => {
      // If Cmd+S / Ctrl+S was recently pressed, ignore blur so it is NOT counted as a tab switch
      if (recentSaveShortcutRef.current) return;

      setTabSwitches((prev) => {
        const next = prev + 1;
        warn('You have left the sandbox window! This incident has been recorded.');
        syncInfractions(next, clipboardAttempts);
        return next;
      });
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setClipboardAttempts((prev) => {
        const next = prev + 1;
        warn('Copying is disabled in strict mode. This incident has been recorded.');
        syncInfractions(tabSwitches, next);
        return next;
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setClipboardAttempts((prev) => {
        const next = prev + 1;
        warn('Pasting is disabled in strict mode. This incident has been recorded.');
        syncInfractions(tabSwitches, next);
        return next;
      });
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
    };
  }, [loading, submission, tabSwitches, clipboardAttempts, submissionId]);

  // ── Keyboard shortcut: Cmd+S / Ctrl+S to save, Cmd+B / Ctrl+B to toggle explorer ─
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) {
        e.preventDefault();
        e.stopPropagation();

        recentSaveShortcutRef.current = true;
        setTimeout(() => {
          recentSaveShortcutRef.current = false;
        }, 1000);

        flushAndSync().catch(() => {
          // PersistenceStatusIndicator displays error state
        });
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B' || e.code === 'KeyB')) {
        e.preventDefault();
        e.stopPropagation();
        setIsFileTreeOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [flushAndSync]);

  // ── Run Code ─────────────────────────────────────────────────────────────
  const handleRunCode = async () => {
    if (!selectedFile) return;
    setOutputOpen(true);
    await runCodeExecute(files, selectedFile);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!submissionId) return;
    setIsSubmitting(true);
    try {
      // Flush pending debounce — latest code must reach the backend first.
      await flushAndSync();
      await finishSubmission(submissionId);
      clearLocalSnapshot();
      toast.success('Assessment submitted successfully!');
      setIsSubmitting(false);
      setSubmitDialogOpen(false);
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit assessment. Your work is saved locally.';
      toast.error(msg);
      setIsSubmitting(false);
      setSubmitDialogOpen(false);
    }
  };

  // ── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', color: 'text.primary', gap: 2 }}>
        <CircularProgress size={40} sx={{ color: 'primary.main' }} />
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>Loading Editor Environment…</Typography>
      </Box>
    );
  }

  const fileList = Object.keys(files);
  const assessmentTitle = submission?.assessment?.title || 'Sandbox Editor';

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>

      <SandboxToolbar
        title={assessmentTitle}
        persistenceStatus={persistenceStatus}
        isStrictMode={!!submission?.assessment?.strictMode}
        infractionCount={tabSwitches + clipboardAttempts}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        isAIChatOpen={isAIChatOpen}
        onToggleAIChat={() => setIsAIChatOpen((prev) => !prev)}
        isFileTreeOpen={isFileTreeOpen}
        onToggleFileTree={() => setIsFileTreeOpen((prev) => !prev)}
        onRunCode={handleRunCode}
        onSubmit={() => setSubmitDialogOpen(true)}
      />

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Mayéutica AI Socratic Chat */}
        <SandboxAIChat
          submissionId={submissionId ?? ''}
          initialHistory={submission?.chatHistory}
          currentCode={files[selectedFile] ?? ''}
          language={submission?.assessment?.allowedLanguage || 'javascript'}
          lastExecutionOutput={
            executionResult
              ? `${executionResult.stdout || ''}${executionResult.stderr ? `\nSTDERR: ${executionResult.stderr}` : ''}`
              : null
          }
          exerciseGoal={
            [
              submission?.assessment?.title,
              submission?.assessment?.description,
            ]
              .filter(Boolean)
              .join(' - ')
          }
          isOpen={isAIChatOpen}
          onToggle={() => setIsAIChatOpen((prev) => !prev)}
        />

        {/* Center: Code Editor */}
        <SandboxCodeEditor
          value={files[selectedFile] ?? ''}
          fileName={selectedFile}
          onChange={updateFileContent}
          onSave={flushAndSync}
        />

        {/* Right: File Explorer Tree */}
        <SandboxFileTree
          files={fileList}
          selectedFile={selectedFile}
          isOpen={isFileTreeOpen}
          onToggle={() => setIsFileTreeOpen((prev) => !prev)}
          onFileSelect={selectFile}
          onCreateFile={createFile}
          onCreateFolder={createFolder}
          onDeleteFile={deleteFile}
          onDeleteFolder={deleteFolder}
          onMoveFile={moveFile}
        />
      </Box>

      <SandboxOutput
        open={outputOpen}
        onClose={() => setOutputOpen(false)}
        isRunning={isRunning}
        result={executionResult}
      />

      <SandboxSubmitDialog
        open={submitDialogOpen}
        isSubmitting={isSubmitting}
        onClose={() => setSubmitDialogOpen(false)}
        onConfirm={handleSubmit}
      />

      <SandboxWarningDialog
        open={warningOpen}
        message={warningMessage}
        onClose={() => setWarningOpen(false)}
      />
    </Box>
  );
};

export default SandboxEditor;
