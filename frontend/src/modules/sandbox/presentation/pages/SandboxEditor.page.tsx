import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import * as monaco from 'monaco-editor';
import { getSubmissionById, syncSubmission, finishSubmission } from '../../infrastructure/submission.service';
import { toast } from 'react-toastify';

const SandboxEditor: React.FC = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();

  const editorRef = useRef<HTMLDivElement>(null);
  const monacoInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Anti-cheat metrics
  const [tabSwitches, setTabSwitches] = useState(0);
  const [clipboardAttempts, setClipboardAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Initial load
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        if (!submissionId) return;
        const data = await getSubmissionById(submissionId);

        if (data.status !== 'IN_PROGRESS') {
          toast.warning('This assessment has already been submitted or flagged.');
          navigate(-1);
          return;
        }

        setSubmission(data);
        setTabSwitches(data.tabSwitchesCount || 0);
        setClipboardAttempts(data.clipboardAttempts || 0);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load assessment data.');
        navigate(-1);
      }
    };
    fetchSubmission();
  }, [submissionId, navigate]);

  // Editor Initialization
  useEffect(() => {
    if (loading || !editorRef.current || !submission) return;

    if (!monacoInstance.current) {
      const savedCode = submission.codeSnapshot?.code || '// Write your code here\n';
      const language = submission.assessment?.allowedLanguage || 'typescript';

      monacoInstance.current = monaco.editor.create(editorRef.current, {
        value: savedCode,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
      });
    }

    return () => {
      if (monacoInstance.current) {
        monacoInstance.current.dispose();
        monacoInstance.current = null;
      }
    };
  }, [loading, submission]);

  // Anti-cheat mechanisms
  useEffect(() => {
    if (loading || !submission?.assessment?.strictMode) return;

    const handleBlur = () => {
      setTabSwitches(prev => {
        const newVal = prev + 1;
        triggerWarning('You have left the sandbox window! This incident has been recorded.');
        syncInfractions(newVal, clipboardAttempts);
        return newVal;
      });
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setClipboardAttempts(prev => {
        const newVal = prev + 1;
        triggerWarning('Copying is disabled in strict mode. This incident has been recorded.');
        syncInfractions(tabSwitches, newVal);
        return newVal;
      });
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setClipboardAttempts(prev => {
        const newVal = prev + 1;
        triggerWarning('Pasting is disabled in strict mode. This incident has been recorded.');
        syncInfractions(tabSwitches, newVal);
        return newVal;
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
  }, [loading, submission, tabSwitches, clipboardAttempts]);

  // Autosave code periodically
  useEffect(() => {
    if (loading || !submissionId) return;

    const interval = setInterval(() => {
      if (monacoInstance.current) {
        const currentCode = monacoInstance.current.getValue();
        syncSubmission(submissionId, { codeSnapshot: { code: currentCode } }).catch(() => {
          console.error("Autosave failed");
        });
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, submissionId]);

  const triggerWarning = (msg: string) => {
    setWarningMessage(msg);
    setShowWarning(true);
  };

  const syncInfractions = (tabs: number, clips: number) => {
    if (!submissionId) return;
    syncSubmission(submissionId, {
      tabSwitchesCount: tabs,
      clipboardAttempts: clips
    }).catch(console.error);
  };

  const handleSubmit = async () => {
    if (!submissionId) return;
    try {
      // Final sync before submit
      if (monacoInstance.current) {
        const currentCode = monacoInstance.current.getValue();
        await syncSubmission(submissionId, { codeSnapshot: { code: currentCode } });
      }

      await finishSubmission(submissionId);
      toast.success('Assessment submitted successfully!');
      navigate(-1);
    } catch (error) {
      toast.error('Failed to submit assessment.');
    }
  };

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading Editor Environment...</Box>;
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1e1e1e' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#2d2d2d', color: 'white' }}>
        <Typography variant="h6">{submission?.assessment?.title || 'Sandbox Editor'}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {submission?.assessment?.strictMode && (
            <Typography variant="body2" color="error.light">
              Strict Mode Active | Infractions: {tabSwitches + clipboardAttempts}
            </Typography>
          )}
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit Assessment
          </Button>
        </Box>
      </Box>

      {/* Editor */}
      <Box ref={editorRef} sx={{ flex: 1, width: '100%' }} />

      {/* Warning Dialog */}
      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Security Warning</DialogTitle>
        <DialogContent>
          <Typography>{warningMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)} variant="contained" color="error">
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SandboxEditor;
