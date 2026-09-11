import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import CampusForm from '../components/CampusForm.component';
import { getCampusById } from '../../../campus/infrastructure/campus.service';
import type { Campus } from '../../../campus/domain/campus.interfaces';
import { toast } from 'react-toastify';

const CampusEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (campusId: string) => {
    try {
      const campus = await getCampusById(campusId);
      setData(campus);
    } catch (error) {
      toast.error('Failed to load campus');
      navigate('/academic/campuses');
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
        <Link component={RouterLink} color="inherit" to="/academic/campuses">
          Campuses
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Edit Campus
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        {data && <CampusForm initialData={data} />}
      </Paper>
    </Box>
  );
};

export default CampusEdit;
