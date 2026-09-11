import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import CourseEnrollmentForm from '../components/CourseEnrollmentForm.component';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseEnrollmentById } from '../../infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';

const CourseEnrollmentEdit = () => {
  const { id, enrollmentId } = useParams<{ id: string; enrollmentId: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (enrollmentId) {
      fetchData(enrollmentId);
    }
  }, [enrollmentId]);

  const fetchData = async (enrollmentId: string) => {
    try {
      const data = await getCourseEnrollmentById(enrollmentId);
      setInitialData(data);
    } catch (error) {
      toast.error('Failed to load course enrollment');
      navigate(`/assignment/offerings/${id}/enrollments`);
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
        <Link component={RouterLink} color="inherit" to={`/assignment/offerings/${id}/enrollments`}>
          Course Enrollments
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Course Enrollment
        </Typography>
        {initialData && <CourseEnrollmentForm initialData={initialData} offeringId={id} />}
      </Paper>
    </Box>
  );
};

export default CourseEnrollmentEdit;
