import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  SearchOutlined,
  ClearOutlined,
  RefreshOutlined,
  AdminPanelSettingsOutlined,
  LockOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import type { RolesMatrixData } from '../../domain/roles.interfaces';
import { groupPermissionsByModule } from '../../domain/roles.utils';
import { getRolesMatrix } from '../../infrastructure/roles.service';
import { PermissionsMatrix } from '../components/PermissionsMatrix.component';

const RolesPermissionsPage: React.FC = () => {
  const [data, setData] = useState<RolesMatrixData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await getRolesMatrix();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load roles matrix', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load roles and permissions matrix.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  // Compute dynamic grouped permissions based on search query
  const groupedModules = useMemo(() => {
    if (!data?.permissions) return [];
    return groupPermissionsByModule(data.permissions, searchQuery);
  }, [data?.permissions, searchQuery]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link component={RouterLink} color="inherit" to="/" sx={{ textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Typography color="text.secondary">System Settings</Typography>
        <Typography color="text.primary" sx={{ fontWeight: 500 }}>
          Roles & Permissions
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 400,
                letterSpacing: '-0.64px',
                color: 'text.primary',
              }}
            >
              Roles & Permissions
            </Typography>
            <Chip
              icon={<LockOutlined sx={{ fontSize: '13px !important' }} />}
              label="Read-Only"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.72rem',
                fontWeight: 500,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                color: 'text.secondary',
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Visual inspection matrix of active permissions granted to each institutional role.
          </Typography>
        </Box>

        {/* Stats & Search */}
        {data && !loading && !errorMsg && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <TextField
              size="small"
              placeholder="Filter by module or permission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <ClearOutlined sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Loading Skeleton */}
      {loading && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '0.5px solid rgba(255, 255, 255, 0.07)',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="rectangular" width={240} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: 1 }} />
          </Box>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <Box key={n} sx={{ display: 'flex', gap: 2, my: 1.5 }}>
              <Skeleton variant="text" width={240} height={32} />
              <Skeleton variant="text" width={140} height={32} />
              <Skeleton variant="text" width={140} height={32} />
              <Skeleton variant="text" width={140} height={32} />
            </Box>
          ))}
        </Paper>
      )}

      {/* Error State */}
      {!loading && errorMsg && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            border: '0.5px solid',
            borderColor: 'error.main',
            bgcolor: 'background.paper',
            my: 3,
          }}
        >
          <Typography variant="h6" color="error.main" sx={{ mb: 1, fontWeight: 500 }}>
            Unable to Load Roles & Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {errorMsg}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={fetchMatrix}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Retry
          </Button>
        </Paper>
      )}

      {/* Empty State: No Roles Available */}
      {!loading && !errorMsg && data && data.roles.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            backgroundColor: 'background.paper',
            borderRadius: '12px',
            border: '0.5px dashed',
            borderColor: 'divider',
            my: 3,
          }}
        >
          <AdminPanelSettingsOutlined sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5, fontSize: '1rem' }}>
            No roles available.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto' }}>
            There are currently no institutional roles configured in the system.
          </Typography>
        </Paper>
      )}

      {/* Empty State: No Permissions Available */}
      {!loading && !errorMsg && data && data.roles.length > 0 && data.permissions.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
            backgroundColor: 'background.paper',
            borderRadius: '12px',
            border: '0.5px dashed',
            borderColor: 'divider',
            my: 3,
          }}
        >
          <InfoOutlined sx={{ fontSize: 44, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5, fontSize: '1rem' }}>
            No permissions available.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto' }}>
            There are currently no permissions seeded in the database.
          </Typography>
        </Paper>
      )}

      {/* Matrix State */}
      {!loading && !errorMsg && data && data.roles.length > 0 && data.permissions.length > 0 && (
        <PermissionsMatrix roles={data.roles} groups={groupedModules} />
      )}
    </Box>
  );
};

export default RolesPermissionsPage;
