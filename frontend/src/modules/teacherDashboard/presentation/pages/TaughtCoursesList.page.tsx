import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, CardActionArea, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../core/store/auth.store';
import { getCourseOfferings } from '../../../assignment/courseOffering/infrastructure/courseOffering.service';
import type { CourseOffering } from '../../../assignment/courseOffering/domain/courseOffering.interfaces';
import { toast } from 'react-toastify';

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
      // Query course offerings where teacher's userId matches the current user
      const response = await getCourseOfferings({ userId, perPage: 100 });
      setOfferings(response.data);
    } catch (error) {
      toast.error('Failed to load taught courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        My Taught Courses
      </Typography>
      
      {offerings.length === 0 ? (
        <Typography>You are not assigned to teach any courses yet.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {offerings.map((offering) => (
            <Card key={offering.id}>
              <CardActionArea onClick={() => navigate(`/assignment/offerings/${offering.id}/assessments`)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {offering.course?.name || 'Unknown Course'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Section: {offering.section}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Campus: {offering.campus?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Cycle: {offering.cycle?.name}
                  </Typography>
                  <Chip 
                    label="Manage Assessments"
                    color="primary" 
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

export default TaughtCoursesList;
