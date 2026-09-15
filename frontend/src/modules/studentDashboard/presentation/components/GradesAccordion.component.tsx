import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  Assignment,
  AutoAwesome,
  ReportProblemOutlined,
  CalendarTodayOutlined,
  Visibility,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import type { StudentAssessmentGradeItem } from '../../domain/grades.interfaces';

interface GradesAccordionProps {
  item: StudentAssessmentGradeItem;
}

export const GradesAccordion: React.FC<GradesAccordionProps> = ({ item }) => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const isEvaluated = item.submissionStatus === 'EVALUATED' && item.score !== null;

  const getStatusChip = () => {
    switch (item.submissionStatus) {
      case 'EVALUATED':
        return (
          <Chip
            label="Evaluated"
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.75rem',
              backgroundColor: 'rgba(74, 222, 128, 0.12)',
              color: '#4ade80',
              border: '0.5px solid rgba(74, 222, 128, 0.3)',
            }}
          />
        );
      case 'SUBMITTED':
        return (
          <Chip
            label="Submitted - Awaiting Review"
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.75rem',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              color: '#facc15',
              border: '0.5px solid rgba(234, 179, 8, 0.3)',
            }}
          />
        );
      case 'IN_PROGRESS':
        return (
          <Chip
            label="In Progress"
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.75rem',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: '#60a5fa',
              border: '0.5px solid rgba(59, 130, 246, 0.3)',
            }}
          />
        );
      case 'FLAGGED':
        return (
          <Chip
            label="Flagged"
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.75rem',
              backgroundColor: 'rgba(248, 113, 113, 0.12)',
              color: '#f87171',
              border: '0.5px solid rgba(248, 113, 113, 0.3)',
            }}
          />
        );
      case 'NOT_STARTED':
      default:
        return (
          <Chip
            label="Not Started"
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.75rem',
              backgroundColor: 'rgba(157, 158, 159, 0.1)',
              color: 'text.secondary',
              border: '0.5px solid rgba(157, 158, 159, 0.25)',
            }}
          />
        );
    }
  };

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        borderRadius: '10px !important',
        mb: 1.5,
        border: '0.5px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:before': { display: 'none' },
        '&:hover': {
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.35)' : 'rgba(59, 130, 246, 0.5)',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: 'text.secondary' }} />}
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1,
          minHeight: 64,
          '& .MuiAccordionSummary-content': {
            my: 0.5,
            width: '100%',
          },
        }}
      >
        {/* DESKTOP ROW LAYOUT */}
        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: 'minmax(240px, 2.2fr) minmax(130px, 1fr) minmax(110px, 1fr) minmax(140px, 1.2fr)',
            alignItems: 'center',
            width: '100%',
            gap: 2,
            pr: 1,
          }}
        >
          {/* Col 1: Title & Type */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '0.5px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Assignment sx={{ color: '#3b82f6', fontSize: 18 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                <Chip
                  label={item.type}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    borderRadius: '4px',
                    backgroundColor: 'action.hover',
                    color: 'text.secondary',
                  }}
                />
                {!isEvaluated && getStatusChip()}
              </Box>
            </Box>
          </Box>

          {/* Col 2: Score obtained / max score */}
          <Box>
            {isEvaluated ? (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.score} <span style={{ color: '#858687', fontWeight: 400 }}>/ {item.maxScore}</span>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Score obtained
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.8125rem' }}>
                Not evaluated yet
              </Typography>
            )}
          </Box>

          {/* Col 3: Assessment Value */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {item.assessmentValue} pts
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Course Value
            </Typography>
          </Box>

          {/* Col 4: Equivalent Obtained */}
          <Box>
            {isEvaluated && item.equivalentPoints !== null ? (
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#4ade80',
                    fontSize: '0.9375rem',
                  }}
                >
                  {item.equivalentPoints} / {item.assessmentValue}
                </Typography>
                {item.percentage !== null && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    ({item.percentage}%)
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                - / {item.assessmentValue} pts
              </Typography>
            )}
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Equivalent earned
            </Typography>
          </Box>
        </Box>

        {/* MOBILE STACKED LAYOUT */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            width: '100%',
            gap: 1.25,
            pr: 0.5,
          }}
        >
          {/* Top: Icon + Title + Type */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '0.5px solid rgba(59, 130, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Assignment sx={{ color: '#3b82f6', fontSize: 17 }} />
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  lineHeight: 1.35,
                }}
              >
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={item.type}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    borderRadius: '4px',
                  }}
                />
                {!isEvaluated && getStatusChip()}
              </Box>
            </Box>
          </Box>

          {/* Bottom: Score & Equivalent Hierarchy */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 0.75,
              borderTop: '0.5px dashed',
              borderColor: 'divider',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.68rem' }}>
                Raw Score
              </Typography>
              {isEvaluated ? (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {item.score} / {item.maxScore}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.75rem' }}>
                  Not evaluated
                </Typography>
              )}
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.68rem' }}>
                Course Value: {item.assessmentValue} pts
              </Typography>
              {isEvaluated && item.equivalentPoints !== null ? (
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#4ade80' }}>
                  {item.equivalentPoints} / {item.assessmentValue} pts ({item.percentage}%)
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  - / {item.assessmentValue} pts
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      {/* EXPANDED CONTENT */}
      <AccordionDetails
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 1.5,
          pb: 3,
          borderTop: '0.5px solid',
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.18)' : '#fafafa',
        }}
      >
        {/* Metrics Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              color: 'text.secondary',
              mb: 1.5,
              fontSize: '0.7rem',
            }}
          >
            Academic Evaluation Breakdown
          </Typography>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem' }}>
                  Maximum Score
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                  {item.maxScore} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>pts</span>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem' }}>
                  Score Obtained
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: isEvaluated ? 'text.primary' : 'text.secondary',
                    mt: 0.25,
                  }}
                >
                  {isEvaluated ? `${item.score} pts` : 'Pending'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem' }}>
                  Assessment Value
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                  {item.assessmentValue} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>pts</span>
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 6, md: 2.4 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: isEvaluated ? 'rgba(74, 222, 128, 0.3)' : 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem' }}>
                  Equivalent Earned
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: isEvaluated ? '#4ade80' : 'text.secondary',
                    mt: 0.25,
                  }}
                >
                  {isEvaluated && item.equivalentPoints !== null
                    ? `${item.equivalentPoints} / ${item.assessmentValue}`
                    : `- / ${item.assessmentValue}`}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Box
                sx={{
                  p: 1.75,
                  borderRadius: '8px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.72rem' }}>
                  Percentage Obtained
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                  {isEvaluated && item.percentage !== null ? `${item.percentage}%` : 'Pending'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Description & Due Date if available */}
        {(item.description || item.dueDate) && (
          <Box sx={{ mb: 2.5 }}>
            {item.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, lineHeight: 1.6 }}>
                {item.description}
              </Typography>
            )}
            {item.dueDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', fontSize: '0.75rem' }}>
                <CalendarTodayOutlined sx={{ fontSize: 14 }} />
                <span>
                  Due Date:{' '}
                  {new Date(item.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </Box>
            )}
          </Box>
        )}

        {/* AI FEEDBACK SECTION - Gracefully render ONLY if non-empty string exists */}
        {item.aiFeedback && item.aiFeedback.trim() !== '' && (
          <Box
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: '10px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.05)' : '#f0f7ff',
              border: '0.5px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <AutoAwesome sx={{ color: '#60a5fa', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#60a5fa' }}>
                AI Academic Feedback
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.65,
                fontSize: '0.875rem',
              }}
            >
              {item.aiFeedback}
            </Typography>
          </Box>
        )}

        {/* DETECTED MISTAKES / EVALUATION FINDINGS - Gracefully render ONLY if length > 0 */}
        {item.evaluationFindings && item.evaluationFindings.length > 0 && (
          <Box
            sx={{
              mt: 2.5,
              p: 2.5,
              borderRadius: '10px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.05)' : '#fef2f2',
              border: '0.5px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <ReportProblemOutlined sx={{ color: '#f87171', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main' }}>
                Detected Mistakes & Observations
              </Typography>
              <Chip
                label={item.evaluationFindings.length}
                size="small"
                sx={{
                  ml: 'auto',
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: 'rgba(248, 113, 113, 0.15)',
                  color: '#f87171',
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {item.evaluationFindings.map((finding, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: '6px',
                    bgcolor: 'background.paper',
                    border: '0.5px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.light', mb: 0.25 }}>
                    • {finding.title}
                  </Typography>
                  {finding.description && finding.description !== finding.title && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.5 }}>
                      {finding.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Footer Actions if submission exists */}
        {item.submissionId && (
          <Box sx={{ mt: 3, pt: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '0.5px solid', borderColor: 'divider' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              onClick={() => navigate(`/my-courses/${offeringId}/assessments/${item.assessmentId}/feedback`)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.8125rem',
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                },
              }}
            >
              View Full Submission Feedback
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
