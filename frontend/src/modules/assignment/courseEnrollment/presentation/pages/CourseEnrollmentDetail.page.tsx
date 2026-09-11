import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button, Chip } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseEnrollmentById } from '../../infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const CourseEnrollmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CourseEnrollment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (enrollmentId: string) => {
    try {
      const enrollment = await getCourseEnrollmentById(enrollmentId);
      setData(enrollment);
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

  if (!data) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1000, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/assignment/enrollments">
          Course Enrollments
        </Link>
        <Typography color="text.primary">Detail</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Course Enrollment Detail
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/assignment/enrollments/${data.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Student</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {data.student?.user ? `${data.student.user.firstName} ${data.student.user.lastName}` : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Course Offering</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {data.offering?.course ? `${data.offering.course.name} - Sec: ${data.offering.section}` : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Cycle</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {data.offering?.cycle ? `${data.offering.cycle.name} (${data.offering.cycle.year})` : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Campus</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {data.offering?.campus?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={data.status} size="small" />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Final Grade</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.finalGrade ?? 'Pending'}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Enrolled At</Typography>
            <Typography variant="body1">{new Date(data.enrolledAt).toLocaleString()}</Typography>
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

export default CourseEnrollmentDetail;
