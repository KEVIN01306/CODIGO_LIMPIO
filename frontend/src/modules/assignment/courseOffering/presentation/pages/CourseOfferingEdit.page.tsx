import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import CourseOfferingForm from '../components/CourseOfferingForm.component';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getCourseOfferingById } from '../../infrastructure/courseOffering.service';
import type { CourseOffering } from '../../domain/courseOffering.interfaces';
import { toast } from 'react-toastify';

const CourseOfferingEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<CourseOffering | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (offeringId: string) => {
    try {
      const data = await getCourseOfferingById(offeringId);
      setInitialData(data);
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

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/assignment/offerings">
          Course Offerings
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Course Offering
        </Typography>
        {initialData && <CourseOfferingForm initialData={initialData} />}
      </Paper>
    </Box>
  );
};

export default CourseOfferingEdit;
