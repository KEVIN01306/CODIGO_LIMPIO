import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import TeacherForm from '../components/TeacherForm.component';
import { Link as RouterLink } from 'react-router-dom';

const TeacherCreate = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/users/teachers">
          Teachers
        </Link>
        <Typography color="text.primary">Add</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Add New Teacher
        </Typography>
        <TeacherForm />
      </Paper>
    </Box>
  );
};

export default TeacherCreate;
