import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, CardActionArea, Chip, Grid } from '@mui/material';
import { School, ArrowForward, LocationOn, Class } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/auth.store';
import { getCourseEnrollments } from '../../../assignment/courseEnrollment/infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../../assignment/courseEnrollment/domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../shared/components/common/PageHeader';

const MyCoursesList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchData(user.id);
    }
  }, [user]);

  const fetchData = async (userId: string) => {
    try {
      const response = await getCourseEnrollments({ userId, page: 1, perPage: 100 } as any);
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="My Courses"
        subtitle="Access your enrolled courses and view scheduled assessments and coding activities."
      />

      {enrollments.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            backgroundColor: 'background.paper',
            borderRadius: '12px',
            border: '0.5px dashed',
            borderColor: 'divider',
          }}
        >
          <School sx={{ fontSize: 40, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.primary', fontSize: '16px', mb: 0.5 }}>
            No courses found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
            You are not enrolled in any active courses at the moment.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {enrollments.map((enrollment) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={enrollment.id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: '12px',
                    border: '0.5px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
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
                  <CardActionArea
                    onClick={() => navigate(`/my-courses/${enrollment.offeringId}/assessments`)}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    {/* Mission control card header */}
                    <Box
                      sx={{
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#f8fafc'),
                        p: 2.5,
                        color: 'text.primary',
                        borderBottom: '0.5px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 450,
                            fontSize: '16px',
                            letterSpacing: '-0.32px',
                            lineHeight: 1.3,
                            color: 'text.primary',
                            pr: 2,
                          }}
                        >
                          {enrollment.offering?.course?.name || 'Course'}
                        </Typography>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8.77px',
                            backgroundColor: 'background.paper',
                            border: '0.5px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <School sx={{ fontSize: 18, color: 'info.main' }} />
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          mt: 0.5,
                          fontSize: '11px',
                          letterSpacing: '0.02rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Code: {enrollment.offering?.course?.code || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Card Body */}
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '13px' }}>
                        <Class sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <span>Section: <strong style={{ color: 'inherit' }}>{enrollment.offering?.section || 'Default'}</strong></span>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '13px' }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Campus: <strong style={{ color: 'inherit' }}>{enrollment.offering?.campus?.name || 'Main Campus'}</strong>
                        </span>
                      </Box>

                      <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid', borderColor: 'divider' }}>
                        <Chip
                          label={enrollment.status}
                          size="small"
                          sx={{
                            borderRadius: '5.26px',
                            fontWeight: 500,
                            fontSize: '11px',
                            backgroundColor:
                              enrollment.status === 'ENROLLED'
                                ? 'rgba(74, 222, 128, 0.1)'
                                : 'action.hover',
                            color: enrollment.status === 'ENROLLED' ? '#4ade80' : 'text.secondary',
                            border: `0.5px solid ${enrollment.status === 'ENROLLED' ? 'rgba(74, 222, 128, 0.3)' : 'divider'}`,
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'info.main', fontWeight: 450, fontSize: '13px' }}>
                          <span>Assessments</span>
                          <ArrowForward sx={{ fontSize: 14 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyCoursesList;
