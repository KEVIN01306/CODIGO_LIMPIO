import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Chip, Divider } from '@mui/material';
import { getDashboardSummary } from '../../infrastructure/dashboard.service';
import type { DashboardSummary, CourseSummary } from '../../domain/dashboard.interfaces';
import { handleApiError } from '../../../../core/api/api-error-handler';

const CourseCard = ({ course }: { course: CourseSummary }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
    <CardContent>
      <Typography variant="overline" color="text.secondary">
        {course.code}
      </Typography>
      <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
        {course.name}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Chip label={`${course.credits} Créditos`} size="small" color="primary" variant="outlined" />
        <Typography variant="body2" color="text.secondary">
          {course.cycle} - {course.section}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) return null;

  const isStudent = data.user.roles.includes('STUDENT');
  const isTeacher = data.user.roles.includes('TEACHER');

  let greeting = 'Bienvenido';
  if (isStudent) greeting = '¡Hola, Alumno';
  if (isTeacher) greeting = '¡Hola, Profesor';
  if (isStudent && isTeacher) greeting = '¡Hola';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          {greeting} {data.user.firstName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Institución: {data.tenant.name}
        </Typography>
      </Box>

      {isStudent && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Mis Cursos Inscritos</Typography>
          {data.studentCourses.length > 0 ? (
            <Grid container spacing={3}>
              {data.studentCourses.map(course => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">No tienes cursos inscritos en este ciclo.</Typography>
          )}
        </Box>
      )}

      {isTeacher && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>Cursos Impartidos</Typography>
          {data.teacherCourses.length > 0 ? (
            <Grid container spacing={3}>
              {data.teacherCourses.map(course => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">No tienes cursos asignados para impartir.</Typography>
          )}
        </Box>
      )}

      {!isStudent && !isTeacher && (
        <Typography color="text.secondary">
          Parece que tienes un rol administrativo. Usa el menú lateral para gestionar la plataforma.
        </Typography>
      )}
    </Box>
  );
};

export default DashboardPage;
