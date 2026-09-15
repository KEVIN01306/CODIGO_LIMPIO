import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Refresh, School } from '@mui/icons-material';
import { CourseHeaderTabs } from '../components/CourseHeaderTabs.component';
import { GradesAccordion } from '../components/GradesAccordion.component';
import { GradeSummary } from '../components/GradeSummary.component';
import { getStudentCourseGrades } from '../../infrastructure/grades.service';
import type { StudentCourseGradesResponse } from '../../domain/grades.interfaces';

const MyCourseGrades: React.FC = () => {
  const { offeringId } = useParams<{ offeringId: string }>();

  const [data, setData] = useState<StudentCourseGradesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchGrades = async () => {
    if (!offeringId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await getStudentCourseGrades(offeringId);
      setData(response);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
        'Failed to load course grades. Please ensure you are enrolled in this course.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [offeringId]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <CourseHeaderTabs
        courseName={data?.course?.name || 'Course'}
        courseCode={data?.course?.code}
        activeTab="grades"
        title={data?.course?.name ? `${data.course.name} - Grades` : 'Course Grades'}
        subtitle="Review your academic performance, score breakdown, AI evaluation feedback, and cumulative course points."
      />

      {/* Loading state */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: '#3b82f6' }} />
          <Typography variant="body2" color="text.secondary">
            Loading course evaluation and grades...
          </Typography>
        </Box>
      )}

      {/* Error state */}
      {!loading && errorMsg && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            border: '0.5px solid',
            borderColor: 'error.main',
            bgcolor: 'background.paper',
            my: 3,
          }}
        >
          <Typography variant="h6" color="error.main" sx={{ mb: 1, fontWeight: 500 }}>
            Unable to Load Grades
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {errorMsg}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchGrades}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Retry
          </Button>
        </Paper>
      )}

      {/* Empty state: No assessments in course */}
      {!loading && !errorMsg && (!data?.grades || data.grades.length === 0) && (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            backgroundColor: 'background.paper',
            borderRadius: '12px',
            border: '0.5px dashed',
            borderColor: 'divider',
            my: 3,
          }}
        >
          <School sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5, fontSize: '1rem' }}>
            No grades available yet.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto', fontSize: '0.875rem' }}>
            There are currently no scheduled assessments or evaluation records for this course offering.
          </Typography>
        </Paper>
      )}

      {/* Content state */}
      {!loading && !errorMsg && data && data.grades.length > 0 && (
        <Box>
          {/* Section Table Header (Desktop visual guidance) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'minmax(240px, 2.2fr) minmax(130px, 1fr) minmax(110px, 1fr) minmax(140px, 1.2fr)',
              px: 2.5,
              py: 1.25,
              gap: 2,
              mb: 1,
              borderBottom: '0.5px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Assessment Title
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Score
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Course Value
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Equivalent
            </Typography>
          </Box>

          {/* Accordion Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {data.grades.map((item) => (
              <GradesAccordion key={item.assessmentId} item={item} />
            ))}
          </Box>

          {/* Cumulative Total Summary */}
          {data.summary && <GradeSummary summary={data.summary} />}
        </Box>
      )}
    </Box>
  );
};

export default MyCourseGrades;
