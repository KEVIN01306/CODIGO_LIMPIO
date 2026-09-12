import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Divider, Tooltip, Chip } from '@mui/material';
import { useAuthStore } from '../../../../core/store/auth.store';
import { useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  PersonOutlineOutlined,
  Menu as MenuIcon,
  LightModeOutlined,
  DarkModeOutlined,
} from '@mui/icons-material';
import { useSidebar } from '../sidebar/SidebarContext';
import { logout as apiLogout } from '../../../../modules/auth/infrastructure/auth.service';
import { useColorMode } from '../../../../core/theme/ThemeContext';

export const Navbar = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { mode, toggleColorMode } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/perfil');
  };

  const handleLogout = async () => {
    handleMenuClose();
    await apiLogout();
    navigate('/auth/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(11, 12, 14, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 64, px: { xs: 1.5, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{
              p: 1,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/icon.png"
            alt="Logo"
            sx={{ width: 30, height: 30, objectFit: 'contain' }}
          />
          <Typography
            variant="h6"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 450,
              fontSize: '0.95rem',
              color: 'text.primary',
              letterSpacing: '-0.2px',
            }}
          >
            CODE ACADEMY
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Theme Toggle Button */}
          <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              aria-label="toggle theme mode"
              sx={{
                p: 0.9,
                color: 'text.secondary',
                border: '0.5px solid',
                borderColor: 'divider',
                borderRadius: '10px',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: 'text.primary',
                },
              }}
            >
              {mode === 'dark' ? (
                <LightModeOutlined sx={{ fontSize: 20, color: '#fbbf24' }} />
              ) : (
                <DarkModeOutlined sx={{ fontSize: 20, color: '#3b82f6' }} />
              )}
            </IconButton>
          </Tooltip>

          {user && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="body2" sx={{ fontWeight: 450, color: 'text.primary', lineHeight: 1.2, fontSize: '13px' }}>
                {user.name || user.email.split('@')[0]}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1, fontSize: '11px' }}>
                {user.email}
              </Typography>
            </Box>
          )}

          <Tooltip title="Cuenta de usuario">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#e2e8f0'),
                  color: 'text.primary',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 0 0 1.5px rgba(59, 130, 246, 0.25)'
                      : '0 0 0 1.5px rgba(37, 99, 235, 0.2)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Minimal Frosted Account Popover Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  mt: 1.5,
                  minWidth: 260,
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  border: '0.5px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                  p: 0,
                },
              },
            }}
          >
            <Box sx={{ p: 2.5, textAlign: 'center', bgcolor: 'action.hover' }}>
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1f1f21' : '#e2e8f0'),
                  color: 'text.primary',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  mx: 'auto',
                  mb: 1.5,
                  border: '0.5px solid',
                  borderColor: 'divider',
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: 'text.primary' }} noWrap>
                {user?.name || 'Usuario'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }} noWrap>
                {user?.email}
              </Typography>
              <Chip
                label={user?.roles?.[0] || 'USUARIO'}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                  color: 'info.main',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(37, 99, 235, 0.08)',
                  borderRadius: '5.26px',
                }}
              />
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            <Box sx={{ p: 1 }}>
              <MenuItem
                onClick={handleProfile}
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 450,
                  gap: 1.5,
                }}
              >
                <PersonOutlineOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                Mi Perfil
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1,
                  px: 1.5,
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 450,
                  gap: 1.5,
                  color: '#f87171',
                  '&:hover': { bgcolor: 'rgba(248, 113, 113, 0.1)' },
                }}
              >
                <LogoutOutlined fontSize="small" />
                Cerrar Sesión
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
