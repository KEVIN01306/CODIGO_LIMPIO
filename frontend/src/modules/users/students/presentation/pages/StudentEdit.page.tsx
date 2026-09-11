import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Breadcrumbs, Link, CircularProgress } from '@mui/material';
import StudentForm from '../components/StudentForm.component';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../../infrastructure/student.service';
import type { StudentProfile } from '../../domain/student.interfaces';
import { toast } from 'react-toastify';

const StudentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchData = async (studentId: string) => {
    try {
      const data = await getStudentById(studentId);
      setInitialData(data);
    } catch (error) {
      toast.error('Failed to load student profile');
      navigate('/users/students');
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
        <Link component={RouterLink} color="inherit" to="/users/students">
          Students
        </Link>
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Edit Student Profile
        </Typography>
        {initialData && <StudentForm initialData={initialData} />}
      </Paper>
    </Box>
  );
};

export default StudentEdit;
