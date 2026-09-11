import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseOfferingById } from '../../infrastructure/courseOffering.service';
import type { CourseOffering } from '../../domain/courseOffering.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const CourseOfferingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CourseOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (offeringId: string) => {
    try {
      const offering = await getCourseOfferingById(offeringId);
      setData(offering);
    } catch (error) {
      toast.error('Failed to load course offering');
      navigate('/assignment/offerings');
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
        <Link component={RouterLink} color="inherit" to="/assignment/offerings">
          Course Offerings
        </Link>
        <Typography color="text.primary">Detail</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Course Offering Detail
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/assignment/offerings/${data.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Campus</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.campus?.name || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Course</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.course ? `${data.course.code} - ${data.course.name}` : 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Cycle</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.cycle ? `${data.cycle.name} (${data.cycle.year})` : 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Section</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.section}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Teacher</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {data.teacher?.user ? `${data.teacher.user.firstName} ${data.teacher.user.lastName}` : 'Unassigned'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Created At</Typography>
            <Typography variant="body1">{new Date(data.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CourseOfferingDetail;
