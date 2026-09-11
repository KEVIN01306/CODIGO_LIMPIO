import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { Navbar } from './navbar/Navbar';
import { Sidebar } from './sidebar/Sidebar';
import { SidebarProvider, useSidebar } from './sidebar/SidebarContext';

const LayoutContent = () => {
  const { isSidebarOpen } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sidebarWidth = isSidebarOpen ? 260 : 72;
  const contentWidth = isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Sidebar />
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1, 
          width: contentWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

const FullLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default FullLayout;
