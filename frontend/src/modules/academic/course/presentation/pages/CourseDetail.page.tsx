import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button, Chip } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../../course/infrastructure/course.service';
import type { Course } from '../../../course/domain/course.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const CourseDetail = () => {
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

  if (!data) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/academic/courses">
          Courses
        </Link>
        <Typography color="text.primary">{data.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {data.code} - {data.name}
          </Typography>
          <Chip
            label={data.isActive ? 'Active' : 'Inactive'}
            color={data.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/academic/courses/${data.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Code</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.code}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Name</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.name}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Program</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.program?.name || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Credits</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.credits}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary">Description</Typography>
            <Typography variant="body1">{data.description || 'No description provided.'}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Created At</Typography>
            <Typography variant="body1">{new Date(data.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Updated At</Typography>
            <Typography variant="body1">{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CourseDetail;
