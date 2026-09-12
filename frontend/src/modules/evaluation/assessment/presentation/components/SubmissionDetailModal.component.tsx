import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  Divider,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { CheckCircleOutlineOutlined } from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { toast } from 'react-toastify';
import type { AssessmentStudentItem } from '../../../../sandbox/infrastructure/submission.service';
import { downloadSubmissionZip } from '../../infrastructure/submission-zip.util';
import { subscribeToSubmissionEvents } from '../../infrastructure/submission-events.service';

interface Props {
  open: boolean;
  onClose: () => void;
  student: AssessmentStudentItem | null;
  assessmentTitle: string;
  maxScore: number;
  onOpenGradeModal: (student: AssessmentStudentItem) => void;
}

interface FileTreeNode {
  name: string;
  fullPath: string;
  isFolder: boolean;
  children: FileTreeNode[];
}

/**
 * Builds a hierarchical tree from a flat list of file paths.
 */
function buildTree(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode = { name: '', fullPath: '', isFolder: true, children: [] };

  for (const path of paths) {
    const isGitkeep = path.endsWith('/.gitkeep');
    const displayPath = isGitkeep ? path.replace(/\/\.gitkeep$/, '') : path;
    const parts = displayPath.split('/');

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const isFolder = !isLast || isGitkeep;
      const currentPath = parts.slice(0, i + 1).join('/');

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          fullPath: isFolder ? currentPath : path,
          isFolder,
          children: [],
        };
        current.children.push(child);
      }
      current = child;
    }
  }

  const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.isFolder === b.isFolder) {
          return a.name.localeCompare(b.name);
        }
        return a.isFolder ? -1 : 1;
      })
      .map((node) => ({
        ...node,
        children: sortNodes(node.children),
      }));
  };

  return sortNodes(root.children);
}

export const SubmissionDetailModal: React.FC<Props> = ({
  open,
  onClose,
  student,
  assessmentTitle,
  maxScore,
  onOpenGradeModal,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [liveChatHistory, setLiveChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Sync initial chatHistory from student.submission
  useEffect(() => {
    if (student?.submission?.chatHistory && Array.isArray(student.submission.chatHistory)) {
      setLiveChatHistory(student.submission.chatHistory);
    } else {
      setLiveChatHistory([]);
    }
  }, [student?.submission?.id, student?.submission?.chatHistory]);

  // Subscribe to real-time events for this submission while modal is open
  useEffect(() => {
    const submissionId = student?.submission?.id;
    if (!open || !submissionId) {
      setIsLiveConnected(false);
      return;
    }

    const unsubscribe = subscribeToSubmissionEvents(
      submissionId,
      (event) => {
        setIsLiveConnected(true);
        if (event.chatHistory && Array.isArray(event.chatHistory)) {
          setLiveChatHistory(event.chatHistory);
        }
      },
      (err) => {
        console.warn('Real-time submission event subscription error:', err);
        setIsLiveConnected(false);
      }
    );

    return () => {
      unsubscribe();
      setIsLiveConnected(false);
    };
  }, [open, student?.submission?.id]);

  // Auto-scroll when switching to AI tab or when messages update
  useEffect(() => {
    if (activeTab === 2 && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab, liveChatHistory]);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === undefined ? false : !prev[folderPath],
    }));
  };

  const codeSnapshot = student?.submission?.codeSnapshot as Record<string, string> | null;

  const fileList = useMemo(() => {
    if (!codeSnapshot || typeof codeSnapshot !== 'object') return [];
    return Object.keys(codeSnapshot).sort();
  }, [codeSnapshot]);

  const realFiles = useMemo(() => {
    return fileList.filter((f) => !f.endsWith('/.gitkeep'));
  }, [fileList]);

  const tree = useMemo(() => buildTree(fileList), [fileList]);

  // Set default selected file when files change
  useEffect(() => {
    if (realFiles.length > 0 && (!selectedFile || !realFiles.includes(selectedFile))) {
      setSelectedFile(realFiles[0]);
    } else if (fileList.length > 0 && (!selectedFile || !fileList.includes(selectedFile))) {
      setSelectedFile(fileList[0]);
    }
  }, [fileList, realFiles, selectedFile]);

  const renderTreeNode = (node: FileTreeNode, level = 0): React.ReactNode => {
    if (node.isFolder) {
      const isFolderOpen = openFolders[node.fullPath] ?? true;

      return (
        <Box key={node.fullPath}>
          <Box
            onClick={() => toggleFolder(node.fullPath)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 0.6,
              px: 1,
              pl: 1 + level * 1.5,
              cursor: 'pointer',
              color: '#cececf',
              borderRadius: '4px',
              mx: 0.5,
              my: 0.2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
              },
            }}
          >
            <Box sx={{ width: 16, display: 'flex', alignItems: 'center', mr: 0.5 }}>
              {isFolderOpen ? (
                <KeyboardArrowDownIcon sx={{ fontSize: 16, color: '#888' }} />
              ) : (
                <KeyboardArrowRightIcon sx={{ fontSize: 16, color: '#888' }} />
              )}
            </Box>
            {isFolderOpen ? (
              <FolderOpenOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#e5a84b' }} />
            ) : (
              <FolderOutlinedIcon sx={{ fontSize: 16, mr: 1, color: '#e5a84b' }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 600,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.name}
            </Typography>
          </Box>

          <Collapse in={isFolderOpen} timeout="auto" unmountOnExit>
            {node.children.length === 0 ? (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  pl: 1 + (level + 1) * 1.5 + 2,
                  py: 0.3,
                  color: '#666',
                  fontStyle: 'italic',
                  fontSize: '0.7rem',
                }}
              >
                (empty folder)
              </Typography>
            ) : (
              node.children.map((child) => renderTreeNode(child, level + 1))
            )}
          </Collapse>
        </Box>
      );
    }

    // It's a file
    const isSelected = selectedFile === node.fullPath;

    return (
      <Box
        key={node.fullPath}
        onClick={() => setSelectedFile(node.fullPath)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 0.5,
          px: 1,
          pl: 1 + level * 1.5 + 2,
          cursor: 'pointer',
          borderRadius: '4px',
          mx: 0.5,
          my: 0.2,
          bgcolor: isSelected ? '#094771' : 'transparent',
          color: isSelected ? '#ffffff' : '#ccc',
          transition: 'background-color 0.1s ease',
          '&:hover': {
            bgcolor: isSelected ? '#094771' : 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
          },
        }}
      >
        <InsertDriveFileOutlinedIcon
          sx={{
            fontSize: 16,
            mr: 1,
            color: isSelected ? '#75beff' : '#888',
            flexShrink: 0,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            fontWeight: isSelected ? 600 : 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.name}
        </Typography>
      </Box>
    );
  };

  if (!student || !student.submission) return null;

  const sub = student.submission;
  const currentCode = (selectedFile && codeSnapshot && codeSnapshot[selectedFile]) ?? '';
  const totalInfractions = (sub.tabSwitchesCount || 0) + (sub.clipboardAttempts || 0);

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      await downloadSubmissionZip(
        student.fullName,
        student.studentNumber,
        assessmentTitle,
        codeSnapshot
      );
      toast.success('ZIP file downloaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download ZIP');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyCode = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    toast.info('Code copied to clipboard');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth slotProps={{ paper: { sx: { height: '85vh', display: 'flex', flexDirection: 'column' } } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Submission by {student.fullName}
          </Typography>
          <Chip label={`Student ID: ${student.studentNumber}`} size="small" variant="outlined" />
          <Chip
            label={sub.totalScore !== null && sub.totalScore !== undefined ? `${sub.totalScore} / ${maxScore} pts` : 'Ungraded'}
            color={sub.totalScore !== null && sub.totalScore !== undefined ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          {totalInfractions > 0 ? (
            <Chip
              icon={<WarningAmberIcon />}
              label={`${totalInfractions} integrity infraction(s)`}
              color="error"
              size="small"
              variant="outlined"
            />
          ) : (
            <Chip
              icon={<CheckCircleOutlineOutlined />}
              label="No integrity infractions"
              color="success"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onOpenGradeModal(student)}
          >
            Edit Grade
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadZip}
            disabled={downloading || fileList.length === 0}
          >
            Download ZIP
          </Button>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab icon={<CodeIcon fontSize="small" />} iconPosition="start" label="Code Structure & Files" />
          <Tab icon={<SecurityIcon fontSize="small" />} iconPosition="start" label="Integrity, Tests & Details" />
          <Tab
            icon={<AutoAwesomeIcon fontSize="small" sx={{ color: activeTab === 2 ? 'primary.main' : 'inherit' }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <span>AI Conversation</span>
                {liveChatHistory.length > 0 && (
                  <Chip
                    label={liveChatHistory.length}
                    size="small"
                    sx={{ height: 18, fontSize: '0.65rem', px: 0.2 }}
                  />
                )}
                {isLiveConnected && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#22c55e',
                      boxShadow: '0 0 6px #22c55e',
                    }}
                  />
                )}
              </Box>
            }
          />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* TAB 0: CODE EXPLORER & PREVIEW */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
            {/* File List / Explorer */}
            <Box
              sx={{
                width: 250,
                borderRight: '1px solid #333',
                bgcolor: '#1e1e1e',
                color: '#ccc',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              <Box sx={{ p: 1.5, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#999', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Files ({realFiles.length})
                </Typography>
              </Box>

              {realFiles.length === 0 && tree.length === 0 ? (
                <Box sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    No code files recorded in this submission.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ overflowY: 'auto', flex: 1, py: 0.8 }}>
                  {tree.map((node) => renderTreeNode(node, 0))}
                </Box>
              )}
            </Box>

            {/* Code Content Viewer */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#141414', overflow: 'hidden' }}>
              {/* Code viewer header */}
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: '#1f1f1f',
                  borderBottom: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#e0e0e0', fontWeight: 'bold' }}>
                  {selectedFile || 'Select a file'}
                </Typography>
                {currentCode && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#888', mr: 1 }}>
                      {currentCode.split('\n').length} lines
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton size="small" onClick={handleCopyCode} sx={{ color: '#aaa' }}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>

              {/* Code text lines */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 0, bgcolor: '#181818' }}>
                {fileList.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      This submission does not contain code files saved in the snapshot.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      p: 2,
                      fontFamily: '"Fira Code", Menlo, Monaco, Consolas, monospace',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      color: '#d4d4d4',
                      overflowX: 'auto',
                    }}
                  >
                    <code>
                      {currentCode.split('\n').map((line, idx) => (
                        <div key={idx} style={{ display: 'flex' }}>
                          <span
                            style={{
                              width: '40px',
                              textAlign: 'right',
                              paddingRight: '16px',
                              color: '#6e7681',
                              userSelect: 'none',
                              fontSize: '0.78rem',
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span style={{ whiteSpace: 'pre', flex: 1 }}>{line || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}

        {/* TAB 1: INTEGRITY & DETAILS */}
        {activeTab === 1 && (
          <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
            {/* Integrity report section */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" /> Student Integrity Metrics (Infractions)
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, borderColor: sub.tabSwitchesCount > 0 ? 'error.light' : 'success.light' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Tab / Window Switches
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold', color: sub.tabSwitchesCount > 0 ? 'error.main' : 'success.main' }}>
                  {sub.tabSwitchesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sub.tabSwitchesCount === 0
                    ? 'The student remained in the assessment window without leaving.'
                    : `The student left the assessment tab ${sub.tabSwitchesCount} time(s) during the evaluation.`}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderColor: sub.clipboardAttempts > 0 ? 'warning.light' : 'success.light' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Clipboard Attempts (Copy / Paste)
                </Typography>
                <Typography variant="h4" sx={{ my: 1, fontWeight: 'bold', color: sub.clipboardAttempts > 0 ? 'warning.main' : 'success.main' }}>
                  {sub.clipboardAttempts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sub.clipboardAttempts === 0
                    ? 'No unauthorized clipboard usage attempts detected.'
                    : `Detected ${sub.clipboardAttempts} attempt(s) to use the clipboard.`}
                </Typography>
              </Paper>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* General Submission details */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Submission Status & Timestamps
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                <div>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{sub.status}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="text.secondary">Started At</Typography>
                  <Typography variant="body2">{sub.startedAt ? new Date(sub.startedAt).toLocaleString() : 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="text.secondary">Submitted At</Typography>
                  <Typography variant="body2">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'In Progress'}</Typography>
                </div>
              </Box>
            </Paper>

            {/* AI or automated feedback */}
            {(sub.feedback || sub.testOutput) && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Automated Feedback & Test Results
                </Typography>
                {sub.feedback && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Comments / Feedback:</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {typeof sub.feedback === 'string' ? sub.feedback : JSON.stringify(sub.feedback, null, 2)}
                    </Typography>
                  </Alert>
                )}
                {sub.testOutput && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                      Unit Tests Output:
                    </Typography>
                    <Box component="pre" sx={{ m: 0, mt: 1, fontSize: '0.8rem', overflowX: 'auto' }}>
                      {JSON.stringify(sub.testOutput, null, 2)}
                    </Box>
                  </Paper>
                )}
              </>
            )}
          </Box>
        )}

        {/* TAB 2: AI CONVERSATION */}
        {activeTab === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', bgcolor: '#0b0c0e' }}>
            {/* Header info bar */}
            <Box
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: '#131416',
                borderBottom: '0.5px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: 'rgba(59, 130, 246, 0.15)',
                    border: '0.5px solid rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <AutoAwesomeIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    Mayéutica Socratic Tutoring Session
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#858687' }}>
                    Read-only view of student's conversation with the AI tutor
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="Read-Only"
                  size="small"
                  variant="outlined"
                  sx={{ color: '#9d9e9f', borderColor: 'rgba(255, 255, 255, 0.12)', fontSize: '0.72rem' }}
                />
                <Chip
                  label={isLiveConnected ? 'Live Sync Active' : 'Offline'}
                  size="small"
                  sx={{
                    bgcolor: isLiveConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: isLiveConnected ? '#4ade80' : '#858687',
                    border: isLiveConnected ? '0.5px solid rgba(74, 222, 128, 0.3)' : '0.5px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>

            {/* Conversation Messages Container */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                },
              }}
            >
              {liveChatHistory.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 4,
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '14px',
                      bgcolor: 'rgba(255, 255, 255, 0.04)',
                      border: '0.5px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#71717a',
                    }}
                  >
                    <SmartToyOutlinedIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#cececf', fontWeight: 500 }}>
                    No AI conversation yet.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#71717a', maxWidth: 360, fontSize: '0.84rem' }}>
                    The student has not yet interacted with Mayéutica during this assessment session. Any questions asked will appear here in real time.
                  </Typography>
                </Box>
              ) : (
                liveChatHistory.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-start' : 'flex-start',
                        gap: 0.8,
                        width: '100%',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={isUser ? <PersonIcon sx={{ fontSize: '14px !important' }} /> : <AutoAwesomeIcon sx={{ fontSize: '14px !important' }} />}
                          label={isUser ? `Student (${student.fullName})` : 'Mayéutica (AI Tutor)'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            bgcolor: isUser ? 'rgba(255, 255, 255, 0.08)' : 'rgba(59, 130, 246, 0.15)',
                            color: isUser ? '#ffffff' : '#60a5fa',
                            border: isUser ? '0.5px solid rgba(255, 255, 255, 0.12)' : '0.5px solid rgba(59, 130, 246, 0.3)',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#71717a', fontSize: '0.7rem' }}>
                          Message #{idx + 1}
                        </Typography>
                      </Box>

                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: isUser ? '#18191c' : '#14171d',
                          borderColor: isUser ? 'rgba(255, 255, 255, 0.08)' : 'rgba(59, 130, 246, 0.25)',
                          borderRadius: '10px',
                          borderLeft: isUser ? '3px solid #71717a' : '3px solid #3b82f6',
                          color: '#e5e7eb',
                          fontSize: '0.86rem',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          maxWidth: '96%',
                        }}
                      >
                        {msg.content}
                      </Paper>
                    </Box>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

