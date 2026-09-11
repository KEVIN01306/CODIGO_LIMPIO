import { Box, Typography, Paper, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import AssessmentForm from '../components/AssessmentForm.component';

const AssessmentCreate = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} color="inherit" to="/assignment/offerings">Course Offerings</MuiLink>
        <MuiLink component={Link} color="inherit" to={`/assignment/offerings/${id}/assessments`}>Assessments</MuiLink>
        <Typography color="text.primary">Create</Typography>
      </Breadcrumbs>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create New Assessment
        </Typography>
        <AssessmentForm offeringId={id} />
      </Paper>
    </Box>
  );
};

export default AssessmentCreate;
