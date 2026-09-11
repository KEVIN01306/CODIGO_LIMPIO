import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import AcademicProgramForm from '../components/AcademicProgramForm.component';
import { getAcademicProgramById } from '../../../program/infrastructure/academicProgram.service';
import type { AcademicProgram } from '../../../program/domain/academicProgram.interfaces';
import { toast } from 'react-toastify';

const AcademicProgramEdit = () => {
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/academic/programs">
          Programs
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Edit Academic Program
      </Typography>

      <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
        {data && <AcademicProgramForm initialData={data} />}
      </Paper>
    </Box>
  );
};

export default AcademicProgramEdit;
