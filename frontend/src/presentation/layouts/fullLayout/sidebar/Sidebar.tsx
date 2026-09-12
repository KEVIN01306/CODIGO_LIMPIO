import { Drawer, List, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuItems, { type MenuItem } from './menuItems';
import { SidebarItem } from './SidebarItem';
import { useAuthStore } from '../../../../core/store/auth.store';
import { useMemo } from 'react';
import { useSidebar } from './SidebarContext';

const drawerWidth = 260;

const filterMenu = (items: MenuItem[], isStudent: boolean, isTeacher: boolean, userPermissions: string[]): MenuItem[] => {
  return items.map(item => {
    const cloned = { ...item };
    if (cloned.children) {
      cloned.children = filterMenu(cloned.children, isStudent, isTeacher, userPermissions);
    }
    return cloned;
  }).filter(item => {
    if (item.requiresStudent && !isStudent) return false;
    if (item.requiresTeacher && !isTeacher) return false;
    if (item.permissions && item.permissions.length > 0 && !item.permissions.some(p => userPermissions.includes(p))) {
      return false;
    }
    if (item.children && item.children.length === 0 && item.module) {
      return false;
    }
    return true;
  });
};

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredItems = useMemo(() => {
    if (!user) return [];

    const isStudent = user.isStudent || false;
    const isTeacher = user.isTeacher || false;
    const permissions = user.permissions || [];

    return filterMenu(MenuItems, isStudent, isTeacher, permissions);
  }, [user]);

  const currentWidth = isSidebarOpen ? drawerWidth : 72;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? isSidebarOpen : true}
      onClose={isMobile ? toggleSidebar : undefined}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          borderRight: '0.5px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ p: isSidebarOpen ? 2.5 : 2, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: isSidebarOpen ? 'flex-start' : 'center', minHeight: 64 }}>
        <Box
          component="img"
          src="/icon.png"
          alt="Logo"
          sx={{ width: 28, height: 28, objectFit: 'contain' }}
        />
        {isSidebarOpen && (
          <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', letterSpacing: '-0.2px', color: 'text.primary' }} variant="h6" noWrap>
            CODE ACADEMY
          </Typography>
        )}
      </Box>
      <List sx={{ px: 1 }}>
        {filteredItems.map((item, index) => (
          <SidebarItem key={index} item={item} isSidebarOpen={isSidebarOpen} />
        ))}
      </List>
    </Drawer>
  );
};
