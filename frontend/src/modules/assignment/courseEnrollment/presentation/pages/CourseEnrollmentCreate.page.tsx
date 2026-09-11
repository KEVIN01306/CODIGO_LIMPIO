import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import CourseEnrollmentForm from '../components/CourseEnrollmentForm.component';
import { Link as RouterLink, useParams } from 'react-router-dom';

const CourseEnrollmentCreate = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to={`/assignment/offerings/${id}/enrollments`}>
          Course Enrollments
        </Link>
        <Typography color="text.primary">Enroll Student</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Enroll Student in Course Offering
        </Typography>
        <CourseEnrollmentForm offeringId={id} />
      </Paper>
    </Box>
  );
};

export default CourseEnrollmentCreate;
