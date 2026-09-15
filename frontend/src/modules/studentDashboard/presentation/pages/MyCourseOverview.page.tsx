import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  School,
  Class,
  LocationOn,
  DateRange,
  PersonOutlined,
  AssignmentOutlined,
  FactCheckOutlined,
} from '@mui/icons-material';
import { CourseHeaderTabs } from '../components/CourseHeaderTabs.component';
import { getCourseOfferingById } from '../../../assignment/courseOffering/infrastructure/courseOffering.service';
import type { CourseOffering } from '../../../assignment/courseOffering/domain/courseOffering.interfaces';

const MyCourseOverview: React.FC = () => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<CourseOffering | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (offeringId) {
      fetchOffering(offeringId);
    }
  }, [offeringId]);

  const fetchOffering = async (id: string) => {
    setLoading(true);
    try {
      const offering = await getCourseOfferingById(id);
      setData(offering);
    } catch {
      // Gracefully handle or ignore
    } finally {
      setLoading(false);
    }
  };

  const courseName = data?.course?.name || 'Course Overview';
  const courseCode = data?.course?.code;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: '0 auto' }}>
      <CourseHeaderTabs
        courseName={courseName}
        courseCode={courseCode}
        activeTab="overview"
        title={courseName}
        subtitle="Course information, instructor details, and direct access to academic assessments."
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#3b82f6' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Main Info Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: '12px',
              border: '0.5px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              Course Information
            </Typography>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <School sx={{ color: '#3b82f6', fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Course
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.course?.name || 'N/A'} ({data?.course?.code || 'N/A'})
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Class sx={{ color: '#60a5fa', fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Section
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.section || 'Default'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOn sx={{ color: '#4ade80', fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Campus
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.campus?.name || 'Main Campus'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DateRange sx={{ color: '#facc15', fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Academic Cycle
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.cycle ? `${data.cycle.name} (${data.cycle.year})` : 'Active Cycle'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PersonOutlined sx={{ color: '#c084fc', fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      Teacher
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.teacher?.user
                        ? `${data.teacher.user.firstName} ${data.teacher.user.lastName}`
                        : 'Assigned Teacher'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Action Navigation Cards */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '0.5px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssignmentOutlined sx={{ color: '#3b82f6', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                    Course Assessments
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View scheduled evaluation tasks, programming exams, and submit your code assignments.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/my-courses/${offeringId}/assessments`)}
                  sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none' }}
                >
                  Go to Assessments
                </Button>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  border: '0.5px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FactCheckOutlined sx={{ color: '#4ade80', fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                    Course Grades
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Check your grades, equivalent point distribution, AI feedback, and cumulative course score.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/my-courses/${offeringId}/grades`)}
                  sx={{ mt: 1, alignSelf: 'flex-start', textTransform: 'none' }}
                >
                  Go to Grades
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MyCourseOverview;
