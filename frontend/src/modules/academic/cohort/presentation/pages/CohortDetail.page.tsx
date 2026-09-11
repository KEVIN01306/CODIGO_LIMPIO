import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCohortById } from '../../../cohort/infrastructure/cohort.service';
import type { Cohort } from '../../../cohort/domain/cohort.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const CohortDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Cohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (cohortId: string) => {
    try {
      const cohort = await getCohortById(cohortId);
      setData(cohort);
    } catch (error) {
      toast.error('Failed to load cohort');
      navigate('/academic/cohorts');
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
        <Link component={RouterLink} color="inherit" to="/academic/cohorts">
          Cohorts
        </Link>
        <Typography color="text.primary">{data.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Cohort Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/academic/cohorts/${data.id}/edit`)}
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
            <Typography variant="caption" color="text.secondary">Start Year</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.startYear}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} >
            <Typography variant="caption" color="text.secondary">Campus</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.campus?.name || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Program</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{data.program?.name || 'N/A'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
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

export default CohortDetail;
