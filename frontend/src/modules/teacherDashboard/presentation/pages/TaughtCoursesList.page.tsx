import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, CardActionArea, Chip, Grid } from '@mui/material';
import { School, ArrowForward, LocationOn, Class, DateRange } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/auth.store';
import { getCourseOfferings } from '../../../assignment/courseOffering/infrastructure/courseOffering.service';
import type { CourseOffering } from '../../../assignment/courseOffering/domain/courseOffering.interfaces';
import { toast } from 'react-toastify';
import PageHeader from '../../../../shared/components/common/PageHeader';

const TaughtCoursesList = () => {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      fetchTaughtCourses(user.id);
    }
  }, [user]);

  const fetchTaughtCourses = async (userId: string) => {
    try {
      const response = await getCourseOfferings({ userId, perPage: 100 });
      setOfferings(response.data);
    } catch (error) {
      toast.error('Failed to load taught courses');
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
        title="My Taught Courses"
        subtitle="Manage assessments, student progress, and assignments for your assigned courses."
      />

      {offerings.length === 0 ? (
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
            No courses assigned
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
            You are not currently assigned to teach any course offerings.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {offerings.map((offering) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={offering.id}>
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
                    onClick={() => navigate(`/assignment/offerings/${offering.id}/assessments`)}
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
                          {offering.course?.name || 'Course'}
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
                        Code: {offering.course?.code || 'N/A'}
                      </Typography>
                    </Box>

                    {/* Card Body */}
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '13px' }}>
                        <Class sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <span>Section: <strong style={{ color: 'inherit' }}>{offering.section}</strong></span>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '13px' }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Campus: <strong style={{ color: 'inherit' }}>{offering.campus?.name || 'Main Campus'}</strong>
                        </span>
                      </Box>

                      {offering.cycle && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '13px' }}>
                          <DateRange sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <span>Cycle: <strong style={{ color: 'inherit' }}>{offering.cycle.name}</strong></span>
                        </Box>
                      )}

                      <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '0.5px solid', borderColor: 'divider' }}>
                        <Chip
                          label="Manage Assessments"
                          size="small"
                          sx={{
                            borderRadius: '5.26px',
                            fontWeight: 500,
                            fontSize: '11px',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#60a5fa',
                            border: '0.5px solid rgba(59, 130, 246, 0.3)',
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'info.main', fontWeight: 450, fontSize: '13px' }}>
                          <span>Open</span>
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

export default TaughtCoursesList;
