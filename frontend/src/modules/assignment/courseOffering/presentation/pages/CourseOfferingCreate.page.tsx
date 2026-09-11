import React from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import CourseOfferingForm from '../components/CourseOfferingForm.component';
import { Link as RouterLink } from 'react-router-dom';

const CourseOfferingCreate = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/assignment/offerings">
          Course Offerings
        </Link>
        <Typography color="text.primary">Create</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Create Course Offering
        </Typography>
        <CourseOfferingForm />
      </Paper>
    </Box>
  );
};

export default CourseOfferingCreate;
