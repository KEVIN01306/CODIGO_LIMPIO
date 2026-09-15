import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Tabs, Tab } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  NavigateNext,
  AssignmentOutlined,
  FactCheckOutlined,
  InfoOutlined,
} from '@mui/icons-material';

interface CourseHeaderTabsProps {
  courseName?: string;
  courseCode?: string;
  activeTab: 'overview' | 'assessments' | 'grades';
  title?: string;
  subtitle?: string;
}

export const CourseHeaderTabs: React.FC<CourseHeaderTabsProps> = ({
  courseName = 'Course',
  courseCode,
  activeTab,
  title,
  subtitle,
}) => {
  const { offeringId } = useParams<{ offeringId: string }>();
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    if (!offeringId) return;
    if (newValue === 'overview') {
      navigate(`/my-courses/${offeringId}/overview`);
    } else if (newValue === 'assessments') {
      navigate(`/my-courses/${offeringId}/assessments`);
    } else if (newValue === 'grades') {
      navigate(`/my-courses/${offeringId}/grades`);
    }
  };

  const getBreadcrumbTabName = () => {
    switch (activeTab) {
      case 'overview':
        return 'Overview';
      case 'assessments':
        return 'Assessments';
      case 'grades':
        return 'Grades';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" sx={{ color: 'text.secondary' }} />}
        sx={{ mb: 2, fontSize: '0.875rem' }}
      >
        <MuiLink
          component={Link}
          to="/my-courses"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: '#60a5fa', textDecoration: 'underline' },
          }}
        >
          My Courses
        </MuiLink>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          {courseName} {courseCode ? `(${courseCode})` : ''}
        </Typography>
        <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '0.875rem' }}>
          {getBreadcrumbTabName()}
        </Typography>
      </Breadcrumbs>

      {/* Header Title & Subtitle */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 450, letterSpacing: '-0.02em', color: 'text.primary' }}>
          {title || courseName}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Course Navigation Tabs */}
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          mt: 1,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          sx={{
            minHeight: 44,
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: 2.5,
              borderRadius: '2px 2px 0 0',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 44,
              py: 1,
              px: { xs: 1.5, sm: 2.5 },
              color: 'text.secondary',
              transition: 'all 0.15s ease',
              '&:hover': {
                color: 'text.primary',
                opacity: 1,
              },
              '&.Mui-selected': {
                color: '#3b82f6',
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab
            value="overview"
            label="Overview"
            icon={<InfoOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="assessments"
            label="Assessments"
            icon={<AssignmentOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            value="grades"
            label="Grades"
            icon={<FactCheckOutlined sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
    </Box>
  );
};
