import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import AcademicCycleForm from '../components/AcademicCycleForm.component';
import { getAcademicCycleById } from '../../../cycle/infrastructure/academicCycle.service';
import type { AcademicCycle } from '../../../cycle/domain/academicCycle.interfaces';
import { toast } from 'react-toastify';

const AcademicCycleEdit = () => {
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/academic/cycles">
          Cycles
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Edit Academic Cycle
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        {data && <AcademicCycleForm initialData={data} />}
      </Paper>
    </Box>
  );
};

export default AcademicCycleEdit;
