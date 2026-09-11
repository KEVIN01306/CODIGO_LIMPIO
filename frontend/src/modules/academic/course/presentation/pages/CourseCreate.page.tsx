import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CourseForm from '../components/CourseForm.component';

const CourseCreate = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/academic/courses">
          Courses
        </Link>
        <Typography color="text.primary">Create</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Create Course
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <CourseForm />
      </Paper>
    </Box>
  );
};

export default CourseCreate;
