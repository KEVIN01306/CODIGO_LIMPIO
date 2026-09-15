import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { BusinessOutlined, SecurityOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { TenantInformationForm } from '../components/TenantInformationForm.component';
import { SebConfigurationForm } from '../components/SebConfigurationForm.component';

const TenantConfigurationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1080, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Typography color="text.secondary">System Settings</Typography>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          Tenant Configuration
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 400,
            letterSpacing: '-0.64px',
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          Tenant Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage institution-wide profile information and global security configurations.
        </Typography>
      </Box>

      {/* Main Container Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '0.5px solid rgba(255, 255, 255, 0.07)',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: '0.5px solid rgba(255, 255, 255, 0.07)', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tenant configuration tabs"
            sx={{
              minHeight: 52,
              '& .MuiTab-root': {
                minHeight: 52,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                gap: 1,
              },
            }}
          >
            <Tab
              icon={<BusinessOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Tenant Information"
              id="tenant-tab-0"
              aria-controls="tenant-tabpanel-0"
            />
            <Tab
              icon={<SecurityOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="SEB Configuration"
              id="tenant-tab-1"
              aria-controls="tenant-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Tab 1: Tenant Information Panel */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tenant-tabpanel-0"
          aria-labelledby="tenant-tab-0"
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4 },
            display: activeTab === 0 ? 'block' : 'none',
          }}
        >
          <TenantInformationForm />
        </Box>

        {/* Tab 2: SEB Configuration Panel */}
        <Box
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tenant-tabpanel-1"
          aria-labelledby="tenant-tab-1"
          sx={{
            p: { xs: 2.5, sm: 3.5, md: 4 },
            display: activeTab === 1 ? 'block' : 'none',
          }}
        >
          <SebConfigurationForm />
        </Box>
      </Paper>
    </Box>
  );
};

export default TenantConfigurationPage;
