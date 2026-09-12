import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../core/store/auth.store';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const { status, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated' || !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
