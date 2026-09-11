import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Divider, Tooltip } from '@mui/material';
import { useAuthStore } from '../../../../core/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, PersonOutlineOutlined, Menu as MenuIcon } from '@mui/icons-material';
import { useSidebar } from '../sidebar/SidebarContext';

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
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

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/auth/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton edge="start" color="primary" aria-label="menu" onClick={toggleSidebar} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            src="/icon.png"
            alt="Logo"
            sx={{ width: 36, height: 36, objectFit: 'contain' }}
          />
          <Typography variant="h6" color="primary" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
            Portal Educativo
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {user.email}
            </Typography>
          )}

          <Tooltip title="Cuenta y Configuración">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '1rem' }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: { mt: 1, minWidth: 200, borderRadius: 2 }
              }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="subtitle2">
                {user?.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Roles: {user?.roles?.join(', ') || 'Sin Rol'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
              <PersonOutlineOutlined fontSize="small" sx={{ mr: 1.5 }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
              <LogoutOutlined fontSize="small" sx={{ mr: 1.5 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
