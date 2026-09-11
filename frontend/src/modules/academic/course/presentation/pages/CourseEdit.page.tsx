import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import CourseForm from '../components/CourseForm.component';
import { getCourseById } from '../../../course/infrastructure/course.service';
import type { Course } from '../../../course/domain/course.interfaces';
import { toast } from 'react-toastify';

const CourseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (courseId: string) => {
    try {
      const course = await getCourseById(courseId);
      setData(course);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/academic/courses');
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
        <Link component={RouterLink} color="inherit" to="/academic/courses">
          Courses
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Edit Course
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        {data && <CourseForm initialData={data} />}
      </Paper>
    </Box>
  );
};

export default CourseEdit;
