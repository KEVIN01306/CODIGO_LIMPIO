import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import CourseEnrollmentForm from '../components/CourseEnrollmentForm.component';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseEnrollmentById } from '../../infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';

const CourseEnrollmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (enrollmentId: string) => {
    try {
      const data = await getCourseEnrollmentById(enrollmentId);
      setInitialData(data);
    } catch (error) {
      toast.error('Failed to load course enrollment');
      navigate('/assignment/enrollments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/assignment/enrollments">
          Course Enrollments
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Course Enrollment
        </Typography>
        {initialData && <CourseEnrollmentForm initialData={initialData} />}
      </Paper>
    </Box>
  );
};

export default CourseEnrollmentEdit;
