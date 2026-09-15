import React from 'react';
import { Box, Typography, Paper, LinearProgress, Divider } from '@mui/material';
import { FactCheckOutlined, CheckCircleOutlineOutlined } from '@mui/icons-material';
import type { CourseGradesSummary } from '../../domain/grades.interfaces';

interface GradeSummaryProps {
  summary: CourseGradesSummary;
}

export const GradeSummary: React.FC<GradeSummaryProps> = ({ summary }) => {
  const percentage = summary.overallPercentage ?? (
    summary.totalPossiblePoints > 0
      ? Number(((summary.totalPointsEarned / summary.totalPossiblePoints) * 100).toFixed(2))
      : 0
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3.5, borderColor: 'divider' }} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '12px',
          border: '0.5px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(180deg, #18191b 0%, #131416 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 2.5,
          }}
        >
          {/* Title & Evaluated Count */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                backgroundColor: 'rgba(74, 222, 128, 0.12)',
                border: '0.5px solid rgba(74, 222, 128, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FactCheckOutlined sx={{ color: '#4ade80', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1.125rem' }}>
                Total Course Points
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                <CheckCircleOutlineOutlined sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>
                  {summary.evaluatedAssessmentsCount} of {summary.totalAssessmentsCount} assessments evaluated
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Points earned counter */}
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: '#4ade80',
                  letterSpacing: '-0.02em',
                }}
              >
                {summary.totalPointsEarned}
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                / {summary.totalPossiblePoints} points
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
              Overall Cumulative Grade: <strong style={{ color: '#60a5fa' }}>{percentage}%</strong>
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #3b82f6 0%, #4ade80 100%)',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
