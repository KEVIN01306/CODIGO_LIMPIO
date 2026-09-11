import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, CardActionArea, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/auth.store';
import { getCourseEnrollments } from '../../../assignment/courseEnrollment/infrastructure/courseEnrollment.service';
import type { CourseEnrollment } from '../../../assignment/courseEnrollment/domain/courseEnrollment.interfaces';
import { toast } from 'react-toastify';

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
      // Backend expects 'userId' for this specific filter per our changes
      const response = await getCourseEnrollments({ userId, page: 1, perPage: 100 } as any);
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        My Courses
      </Typography>

      {enrollments.length === 0 ? (
        <Typography>You are not enrolled in any courses yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardActionArea onClick={() => navigate(`/my-courses/${enrollment.offeringId}/assessments`)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {enrollment.offering?.course?.name || 'Unknown Course'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Section: {enrollment.offering?.section}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Campus: {enrollment.offering?.campus?.name}
                  </Typography>
                  <Chip
                    label={enrollment.status}
                    color={enrollment.status === 'ENROLLED' ? 'primary' : 'default'}
                    size="small"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyCoursesList;
