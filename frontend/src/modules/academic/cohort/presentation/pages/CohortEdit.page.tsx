import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import CohortForm from '../components/CohortForm.component';
import { getCohortById } from '../../../cohort/infrastructure/cohort.service';
import type { Cohort } from '../../../cohort/domain/cohort.interfaces';
import { toast } from 'react-toastify';

const CohortEdit = () => {
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/academic/cohorts">
          Cohorts
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Edit Cohort
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        {data && <CohortForm initialData={data} />}
      </Paper>
    </Box>
  );
};

export default CohortEdit;
