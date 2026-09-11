import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import TeacherForm from '../components/TeacherForm.component';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getTeacherById } from '../../infrastructure/teacher.service';
import type { TeacherProfile } from '../../domain/teacher.interfaces';
import { toast } from 'react-toastify';

const TeacherEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (teacherId: string) => {
    try {
      const data = await getTeacherById(teacherId);
      setInitialData(data);
    } catch (error) {
      toast.error('Failed to load teacher profile');
      navigate('/users/teachers');
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
        <Link component={RouterLink} color="inherit" to="/users/teachers">
          Teachers
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Teacher Profile
        </Typography>
        {initialData && <TeacherForm initialData={initialData} />}
      </Paper>
    </Box>
  );
};

export default TeacherEdit;
