import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Collapse,
  Button,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  NavigateNext,
  ContentCopy,
  FolderOutlined,
  FolderOpenOutlined,
  InsertDriveFileOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
  CheckCircleOutlineOutlined,
  HourglassEmpty,
  ErrorOutlineOutlined,
  ReportProblemOutlined,
  CodeOutlined,
  ArrowBack,
  PlayArrow,
  AutoAwesomeOutlined,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getStudentSubmissionFeedbackByAssessment,
  startSubmission,
  type StudentSubmissionFeedback,
} from '../../../sandbox/infrastructure/submission.service';
import { subscribeToSubmissionEvents } from '../../../evaluation/assessment/infrastructure/submission-events.service';

interface FileTreeNode {
  name: string;
  fullPath: string;
  isFolder: boolean;
  children: FileTreeNode[];
}

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

const StudentAssessmentFeedbackPage: React.FC = () => {
  const { offeringId, assessmentId } = useParams<{ offeringId: string; assessmentId: string }>();
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState<StudentSubmissionFeedback | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const fetchFeedback = async () => {
    if (!assessmentId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getStudentSubmissionFeedbackByAssessment(assessmentId);
      setFeedbackData(data);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setErrorMsg('The assessment has not been submitted yet.');
      } else if (status === 403) {
        setErrorMsg('You are not authorized to view this submission feedback.');
      } else {
        setErrorMsg(err?.response?.data?.message || 'Failed to load submission feedback.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [assessmentId]);

  // Real-time SSE listener
  useEffect(() => {
    const submissionId = feedbackData?.submissionId;
    if (!submissionId) return;

    const unsubscribe = subscribeToSubmissionEvents(
      submissionId,
      (event) => {
        if (event.type === 'SUBMISSION_GRADED' || event.type === 'SUBMISSION_EVALUATED') {
          toast.info('Your submission has been evaluated! Refreshing feedback...');
          fetchFeedback();
        }
      },
      (err) => {
        console.warn('Real-time feedback event error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [feedbackData?.submissionId]);

  // Code Snapshot Explorer Tree
  const codeSnapshot = feedbackData?.submittedCode || null;

  const fileList = useMemo(() => {
    if (!codeSnapshot || typeof codeSnapshot !== 'object') return [];
    return Object.keys(codeSnapshot).sort();
  }, [codeSnapshot]);

  const realFiles = useMemo(() => {
    return fileList.filter((f) => !f.endsWith('/.gitkeep'));
  }, [fileList]);

  const tree = useMemo(() => buildTree(fileList), [fileList]);

  useEffect(() => {
    if (realFiles.length > 0 && (!selectedFile || !realFiles.includes(selectedFile))) {
      setSelectedFile(realFiles[0]);
    } else if (fileList.length > 0 && (!selectedFile || !fileList.includes(selectedFile))) {
      setSelectedFile(fileList[0]);
    }
  }, [fileList, realFiles, selectedFile]);

  const toggleFolder = (folderPath: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: prev[folderPath] === undefined ? false : !prev[folderPath],
    }));
  };

  const handleCopyCode = () => {
    const code = selectedFile && codeSnapshot ? codeSnapshot[selectedFile] : '';
    if (code) {
      navigator.clipboard.writeText(code);
      toast.info('Code copied to clipboard');
    }
  };

  const currentCode = (selectedFile && codeSnapshot && codeSnapshot[selectedFile]) ?? '';

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
              color: 'text.secondary',
              borderRadius: '4px',
              mx: 0.5,
              my: 0.2,
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'text.primary',
              },
            }}
          >
            <Box sx={{ width: 16, display: 'flex', alignItems: 'center', mr: 0.5 }}>
              {isFolderOpen ? (
                <KeyboardArrowDown sx={{ fontSize: 16, color: 'text.secondary' }} />
              ) : (
                <KeyboardArrowRight sx={{ fontSize: 16, color: 'text.secondary' }} />
              )}
            </Box>
            {isFolderOpen ? (
              <FolderOpenOutlined sx={{ fontSize: 16, mr: 1, color: '#e5a84b' }} />
            ) : (
              <FolderOutlined sx={{ fontSize: 16, mr: 1, color: '#e5a84b' }} />
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
                  color: 'text.disabled',
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
          bgcolor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          color: isSelected ? '#60a5fa' : 'text.secondary',
          transition: 'background-color 0.1s ease',
          '&:hover': {
            bgcolor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'action.hover',
            color: 'text.primary',
          },
        }}
      >
        <InsertDriveFileOutlined
          sx={{
            fontSize: 16,
            mr: 1,
            color: isSelected ? '#60a5fa' : 'text.secondary',
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

  if (loading) {
    return (
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
        <Typography variant="body2" color="text.secondary">
          Loading submission feedback…
        </Typography>
      </Box>
    );
  }

  // Handle "Not Submitted" state
  if (errorMsg || !feedbackData) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />}
          sx={{ mb: 2.5, fontSize: '0.875rem' }}
        >
          <MuiLink
            component={Link}
            to="/my-courses"
            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}
          >
            My Courses
          </MuiLink>
          <MuiLink
            component={Link}
            to={`/my-courses/${offeringId}/assessments`}
            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}
          >
            Assessments
          </MuiLink>
          <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>Feedback</Typography>
        </Breadcrumbs>

        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            bgcolor: 'background.paper',
            border: '0.5px solid',
            borderColor: 'divider',
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
          }}
        >
          <ErrorOutlineOutlined sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
            {errorMsg || 'Feedback Unavailable'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {errorMsg === 'The assessment has not been submitted yet.'
              ? 'You have not submitted a solution for this assessment yet. Open the code editor to complete the assignment.'
              : errorMsg}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/my-courses/${offeringId}/assessments`)}
            >
              Back to Assessments
            </Button>
            {assessmentId && (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={async () => {
                  try {
                    const submission = await startSubmission(assessmentId);
                    navigate(`/sandbox/${submission.id}`);
                  } catch {
                    toast.error('Could not start assessment.');
                  }
                }}
              >
                Start Assessment
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  const isEvaluated = feedbackData.status === 'EVALUATED';
  const isSubmitted = feedbackData.status === 'SUBMITTED' || feedbackData.status === 'FLAGGED';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />}
        sx={{ mb: 2.5, fontSize: '0.875rem' }}
      >
        <MuiLink
          component={Link}
          to="/my-courses"
          sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}
        >
          My Courses
        </MuiLink>
        <MuiLink
          component={Link}
          to={`/my-courses/${offeringId}/assessments`}
          sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: '#60a5fa' } }}
        >
          Assessments
        </MuiLink>
        <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
          {feedbackData.assessmentTitle} - Feedback
        </Typography>
      </Breadcrumbs>

      {/* Header Banner */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: '12px',
          bgcolor: 'background.paper',
          border: '0.5px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.75 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 500, letterSpacing: '-0.02em' }}>
              {feedbackData.assessmentTitle}
            </Typography>
            <Chip
              label={feedbackData.allowedLanguage.toUpperCase()}
              size="small"
              sx={{
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.7rem',
                bgcolor: 'rgba(59, 130, 246, 0.12)',
                color: '#60a5fa',
              }}
            />
            {isEvaluated ? (
              <Chip
                icon={<CheckCircleOutlineOutlined sx={{ fontSize: '16px !important' }} />}
                label="Evaluated"
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(34, 197, 94, 0.12)',
                  color: '#4ade80',
                  border: '0.5px solid rgba(34, 197, 94, 0.3)',
                }}
              />
            ) : isSubmitted ? (
              <Chip
                icon={<HourglassEmpty sx={{ fontSize: '16px !important' }} />}
                label="Awaiting Evaluation"
                size="small"
                sx={{
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(234, 179, 8, 0.12)',
                  color: '#facc15',
                  border: '0.5px solid rgba(234, 179, 8, 0.3)',
                }}
              />
            ) : (
              <Chip
                label={feedbackData.status}
                size="small"
                sx={{ borderRadius: '8px', fontSize: '0.75rem' }}
              />
            )}
          </Box>
          {feedbackData.assessmentDescription && (
            <Typography variant="body2" color="text.secondary">
              {feedbackData.assessmentDescription}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Submitted on:{' '}
            {feedbackData.submittedAt
              ? new Date(feedbackData.submittedAt).toLocaleString()
              : 'In Progress'}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/my-courses/${offeringId}/assessments`)}
          sx={{ borderRadius: '8px' }}
        >
          Assessments List
        </Button>
      </Box>

      {/* State: Submitted but not evaluated */}
      {isSubmitted && !isEvaluated && (
        <Alert
          severity="info"
          icon={<HourglassEmpty />}
          sx={{
            mb: 3,
            borderRadius: '12px',
            border: '0.5px solid rgba(59, 130, 246, 0.3)',
            bgcolor: 'rgba(59, 130, 246, 0.08)',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Your assessment has been submitted and is waiting for evaluation.
          </Typography>
          <Typography variant="body2">
            The teacher has not graded your submission yet. Below is the snapshot of the code you submitted for review.
          </Typography>
        </Alert>
      )}

      {/* Evaluated Score Banner */}
      {isEvaluated && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '12px',
            bgcolor: 'background.paper',
            border: '0.5px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05rem', fontWeight: 600 }}>
              Final Evaluation Grade
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 0.5 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 600, color: '#4ade80', letterSpacing: '-0.03em' }}>
                {feedbackData.score !== null ? feedbackData.score : '—'}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                / {feedbackData.maxScore} pts
              </Typography>
              {feedbackData.score !== null && (
                <Chip
                  label={`${Math.round((feedbackData.score / feedbackData.maxScore) * 100)}%`}
                  size="small"
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    bgcolor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    ml: 1,
                  }}
                />
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, textAlign: { sm: 'right' } }}>
            {feedbackData.weight && (
              <Box>
                <Typography variant="caption" color="text.secondary">Course Weight</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{feedbackData.weight}%</Typography>
              </Box>
            )}
            {feedbackData.testsPassedScore !== null && (
              <Box>
                <Typography variant="caption" color="text.secondary">Unit Tests</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{feedbackData.testsPassedScore} pts</Typography>
              </Box>
            )}
            {feedbackData.aiQualityScore !== null && (
              <Box>
                <Typography variant="caption" color="text.secondary">Quality Score</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{feedbackData.aiQualityScore} pts</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* Grid: Teacher Feedback & Evaluation Findings */}
      {isEvaluated && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          {/* Section: AI Feedback */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '12px',
              bgcolor: 'background.paper',
              border: '0.5px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeOutlined sx={{ color: '#a855f7', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                AI Feedback
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {(feedbackData.aiFeedback || feedbackData.teacherComments) ? (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: '8px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#18191b' : '#f8fafc'),
                  borderLeft: '3px solid #a855f7',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                    color: 'text.primary',
                  }}
                >
                  {feedbackData.aiFeedback || feedbackData.teacherComments}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No evaluation feedback has been provided for this submission.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Section: Evaluation Findings / Mistakes */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '12px',
              bgcolor: 'background.paper',
              border: '0.5px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ReportProblemOutlined sx={{ color: '#f87171', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Evaluation Findings & Observations
              </Typography>
              <Chip
                label={feedbackData.evaluationFindings.length}
                size="small"
                sx={{ ml: 'auto', height: 20, fontSize: '0.7rem' }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />

            {feedbackData.evaluationFindings.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {feedbackData.evaluationFindings.map((finding, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#18191b' : '#fef2f2'),
                      border: '0.5px solid',
                      borderColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                        {idx + 1}. {finding.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {finding.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CheckCircleOutlineOutlined sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No evaluation faults detected. Great job!
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {/* Submitted Code Viewer Section */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: '12px',
          bgcolor: 'background.paper',
          border: '0.5px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            px: 2.5,
            borderBottom: '0.5px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#18191b' : '#f8fafc'),
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeOutlined sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Submitted Code Snapshot
            </Typography>
            <Chip
              label="Read-Only Snapshot"
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontSize: '0.7rem',
                bgcolor: 'action.hover',
                color: 'text.secondary',
              }}
            />
          </Box>

          {selectedFile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                {selectedFile}
              </Typography>
              <Tooltip title="Copy code">
                <IconButton size="small" onClick={handleCopyCode} sx={{ color: 'text.secondary' }}>
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {fileList.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              This submission does not contain code files saved in the snapshot.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', height: 500, overflow: 'hidden' }}>
            {/* File Tree Left Pane */}
            <Box
              sx={{
                width: 260,
                flexShrink: 0,
                borderRight: '0.5px solid',
                borderColor: 'divider',
                overflowY: 'auto',
                py: 1.5,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#111214' : '#f1f5f9'),
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  pb: 1,
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05rem',
                  fontSize: '0.7rem',
                }}
              >
                Files ({fileList.length})
              </Typography>
              {tree.map((node) => renderTreeNode(node, 0))}
            </Box>

            {/* Code Content Right Pane */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                bgcolor: '#0d0e11',
                p: 0,
              }}
            >
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
                          width: '45px',
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
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentAssessmentFeedbackPage;
