import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Chip, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  SchoolOutlined,
  MenuBookOutlined,
  PeopleAltOutlined,
  AssignmentOutlined,
  ArrowForward,
  BadgeOutlined,
} from '@mui/icons-material';
import { getDashboardSummary } from '../../infrastructure/dashboard.service';
import type { DashboardSummary, CourseSummary } from '../../domain/dashboard.interfaces';
import { handleApiError } from '../../../../core/api/api-error-handler';

const CourseCard = ({ course, isTeacher }: { course: CourseSummary; isTeacher?: boolean }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    const targetOfferingId = course.offeringId || course.id;
    if (isTeacher) {
      navigate(`/assignment/offerings/${targetOfferingId}/assessments`);
    } else {
      navigate(`/my-courses/${targetOfferingId}/assessments`);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '0.5px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: 'info.main',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 0 0 1px rgba(59, 130, 246, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* Flat Mission-Control Card Header with subtle accent */}
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#f8fafc'),
          color: 'text.primary',
          p: 2.5,
          position: 'relative',
          borderBottom: '0.5px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04rem', fontSize: '11px' }}>
            {course.code} • Sección {course.section}
          </Typography>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 450, fontSize: '16px', letterSpacing: '-0.32px', color: 'text.primary', lineHeight: 1.3 }} noWrap>
          {course.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '12px' }}>
          Cycle: {course.cycle}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
          <Chip
            label={`${course.credits} Créditos`}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 500,
              fontSize: '11px',
              borderRadius: '5.26px',
              borderColor: 'rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              bgcolor: 'rgba(59, 130, 246, 0.08)',
            }}
          />
          <Chip
            label={course.cycle}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: '5.26px',
              borderColor: 'divider',
              color: 'text.secondary',
              fontWeight: 450,
              fontSize: '11px',
              bgcolor: 'action.hover',
            }}
          />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
          onClick={handleNavigate}
          sx={{
            mt: 'auto',
            borderRadius: '10px',
            fontWeight: 450,
            fontSize: '13px',
            textTransform: 'none',
            border: '0.5px solid',
            borderColor: 'divider !important',
            color: 'text.primary',
            backgroundColor: 'action.hover',
            '&:hover': {
              borderColor: 'text.secondary !important',
              backgroundColor: 'action.selected',
            },
          }}
        >
          {isTeacher ? 'Gestionar Evaluaciones' : 'Ver Curso'}
        </Button>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  let greeting = 'Welcome back';
  if (isStudent) greeting = 'Welcome back, Student';
  if (isTeacher) greeting = 'Welcome back, Teacher';
  if (isStudent && isTeacher) greeting = 'Welcome back';

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Hero Welcome Banner */}
      <Card
        elevation={0}
        sx={{
          border: '0.5px solid',
          borderColor: 'divider',
          borderRadius: '12px',
          p: { xs: 3, sm: 3.5 },
          mb: 4,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '24px', sm: '28px' },
              letterSpacing: '-0.64px',
              mb: 0.75,
              color: 'text.primary',
            }}
          >
            {greeting} {data.user.firstName}!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', letterSpacing: '-0.2px' }}>
            Educational institution: <strong style={{ color: 'inherit' }}>{data.tenant.name}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {data.user.roles.map((role) => (
            <Chip
              key={role}
              label={role}
              variant="outlined"
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: 'info.main',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(59, 130, 246, 0.08)'
                    : 'rgba(37, 99, 235, 0.08)',
              }}
            />
          ))}
        </Box>
      </Card>

      {/* Student View */}
      {isStudent && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 400, fontSize: '20px', letterSpacing: '-0.5px', color: 'text.primary' }}>
                My Enrolled Courses
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mt: 0.25 }}>
                Access your courses and active assessments.
              </Typography>
            </Box>
            <Chip
              label={`${data.studentCourses.length} cursos`}
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'divider',
                color: 'text.secondary',
                bgcolor: 'action.hover',
              }}
            />
          </Box>

          {data.studentCourses.length > 0 ? (
            <Grid container spacing={3}>
              {data.studentCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                border: '0.5px dashed',
                borderColor: 'divider',
                borderRadius: '12px',
                bgcolor: 'background.paper',
              }}
            >
              <MenuBookOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 1.5 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 400, fontSize: '16px' }} gutterBottom>
                No tienes cursos inscritos
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                Comunícate con el área académica para registrar tus asignaturas correspondientes.
              </Typography>
            </Card>
          )}
        </Box>
      )}

      {/* Teacher View */}
      {isTeacher && (
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 400, fontSize: '20px', letterSpacing: '-0.5px', color: 'text.primary' }}>
                Cursos Impartidos
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mt: 0.25 }}>
                Supervisa y califica los ejercicios y evaluaciones de tus estudiantes.
              </Typography>
            </Box>
            <Chip
              label={`${data.teacherCourses.length} cursos`}
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: '11px',
                borderRadius: '5.26px',
                borderColor: 'divider',
                color: 'text.secondary',
                bgcolor: 'action.hover',
              }}
            />
          </Box>

          {data.teacherCourses.length > 0 ? (
            <Grid container spacing={3}>
              {data.teacherCourses.map((course) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <CourseCard course={course} isTeacher />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card
              elevation={0}
              sx={{
                p: 5,
                textAlign: 'center',
                border: '0.5px dashed',
                borderColor: 'divider',
                borderRadius: '12px',
                bgcolor: 'background.paper',
              }}
            >
              <SchoolOutlined sx={{ fontSize: 40, color: 'text.secondary', mb: 1.5 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 400, fontSize: '16px' }} gutterBottom>
                No tienes cursos asignados
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                Aún no has sido asignado como docente a ninguna sección académica activa.
              </Typography>
            </Card>
          )}
        </Box>
      )}

      {/* Admin Quick Action Bento Grid */}
      {!isStudent && !isTeacher && (
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 400, fontSize: '20px', letterSpacing: '-0.5px', color: 'text.primary', mb: 0.5 }}>
            Management of the Platform
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 3 }}>
            Access the main academic administration modules quickly.
          </Typography>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: 'info.main', bgcolor: 'action.hover' },
                }}
                onClick={() => navigate('/users/students')}
              >
                <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1f1f21' : '#eff6ff', color: 'info.main', border: '0.5px solid rgba(59, 130, 246, 0.25)', mb: 2, borderRadius: '8.77px' }}>
                  <PeopleAltOutlined sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 450, fontSize: '15px', letterSpacing: '-0.2px', color: 'text.primary', mb: 0.5 }}>
                  Students
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  Manage enrollments, profiles, and student IDs.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' },
                }}
                onClick={() => navigate('/users/teachers')}
              >
                <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1f1f21' : '#f1f5f9', color: 'text.secondary', border: '0.5px solid', borderColor: 'divider', mb: 2, borderRadius: '8.77px' }}>
                  <BadgeOutlined sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 450, fontSize: '15px', letterSpacing: '-0.2px', color: 'text.primary', mb: 0.5 }}>
                  Teachers
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  Manage teacher profiles and assignments.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: 'success.main', bgcolor: 'action.hover' },
                }}
                onClick={() => navigate('/academic/courses')}
              >
                <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1f1f21' : '#f0fdf4', color: 'success.main', border: '0.5px solid rgba(74, 222, 128, 0.25)', mb: 2, borderRadius: '8.77px' }}>
                  <MenuBookOutlined sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 450, fontSize: '15px', letterSpacing: '-0.2px', color: 'text.primary', mb: 0.5 }}>
                  Courses and Catalog
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  Manage careers, cycles, and syllabus subjects.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: 'warning.main', bgcolor: 'action.hover' },
                }}
                onClick={() => navigate('/assignment/offerings')}
              >
                <Avatar sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1f1f21' : '#fff7ed', color: 'warning.main', border: '0.5px solid rgba(234, 88, 12, 0.25)', mb: 2, borderRadius: '8.77px' }}>
                  <AssignmentOutlined sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 450, fontSize: '15px', letterSpacing: '-0.2px', color: 'text.primary', mb: 0.5 }}>
                  Sections and Assignments
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  Open courses, assign teachers, and register enrollments.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
