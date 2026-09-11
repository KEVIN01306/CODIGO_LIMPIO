import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link as MuiLink, CircularProgress } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import AssessmentForm from '../components/AssessmentForm.component';
import { getAssessmentById } from '../../infrastructure/assessment.service';
import type { Assessment } from '../../domain/assessment.interfaces';
import { toast } from 'react-toastify';

const AssessmentEdit = () => {
  const { id, assessmentId } = useParams<{ id: string; assessmentId: string }>();
  const [data, setData] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (assessmentId) {
      fetchAssessment(assessmentId);
    }
  }, [assessmentId]);

  const fetchAssessment = async (assessmentId: string) => {
    try {
      const result = await getAssessmentById(assessmentId);
      setData(result);
    } catch (error) {
      toast.error('Failed to load assessment data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (!data) return <Box sx={{ p: 3 }}><Typography>Assessment not found</Typography></Box>;

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} color="inherit" to="/assignment/offerings">Course Offerings</MuiLink>
        <MuiLink component={Link} color="inherit" to={`/assignment/offerings/${id}/assessments`}>Assessments</MuiLink>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Assessment
        </Typography>
        <AssessmentForm initialData={data} offeringId={id} />
      </Paper>
    </Box>
  );
};

export default AssessmentEdit;
