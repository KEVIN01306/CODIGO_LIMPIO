import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress, Grid, Divider, Button } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getAcademicProgramById } from '../../../program/infrastructure/academicProgram.service';
import type { AcademicProgram } from '../../../program/domain/academicProgram.interfaces';
import { toast } from 'react-toastify';
import { Edit } from '@mui/icons-material';

const AcademicProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AcademicProgram | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (programId: string) => {
    try {
      const program = await getAcademicProgramById(programId);
      setData(program);
    } catch (error) {
      toast.error('Failed to load academic program');
      navigate('/academic/programs');
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
        <Link component={RouterLink} color="inherit" to="/academic/programs">
          Programs
        </Link>
        <Typography color="text.primary">{data.code}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Program Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/academic/programs/${data.id}/edit`)}
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

export default AcademicProgramDetail;
