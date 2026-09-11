import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getAcademicCycleById } from '../../../cycle/infrastructure/academicCycle.service';
import type { AcademicCycle } from '../../../cycle/domain/academicCycle.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const AcademicCycleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AcademicCycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (cycleId: string) => {
    try {
      const cycle = await getAcademicCycleById(cycleId);
      setData(cycle);
    } catch (error) {
      toast.error('Failed to load academic cycle');
      navigate('/academic/cycles');
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
        <Link component={RouterLink} color="inherit" to="/academic/cycles">
          Cycles
        </Link>
        <Typography color="text.primary">{data.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Cycle Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/academic/cycles/${data.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Name</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.name}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Campus</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.campus?.name || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Year</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.year}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Order</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.order}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Is Current</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.isCurrent ? 'Yes' : 'No'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Start Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{new Date(data.startDate).toLocaleString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">End Date</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{new Date(data.endDate).toLocaleString()}</Typography>
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

export default AcademicCycleDetail;
